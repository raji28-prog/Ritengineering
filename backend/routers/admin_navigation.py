import sqlite3
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_admin
from backend.models.schemas import NavItemCreateUpdate, NavReorderRequest

router = APIRouter(prefix="/admin/navigation", tags=["Admin Navigation"])

def build_menu_tree(items: list[dict], parent_id: Optional[int] = None) -> list[dict]:
    branch = []
    for item in items:
        if item.get("parent_id") == parent_id:
            children = build_menu_tree(items, item["id"])
            branch.append({**item, "children": children})
    return branch

def is_descendant(db: sqlite3.Connection, item_id: int, potential_parent_id: Optional[int]) -> bool:
    if not potential_parent_id:
        return False
    if item_id == potential_parent_id:
        return True
    row = db.execute("SELECT parent_id FROM navigation_items WHERE id = ?", (potential_parent_id,)).fetchone()
    if not row or not row["parent_id"]:
        return False
    return is_descendant(db, item_id, row["parent_id"])

@router.get("")
def get_admin_navigation(menu_key: str = Query("main_header"), current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    menu = dict_from_row(db.execute("SELECT * FROM navigation_menus WHERE menu_key = ?", (menu_key,)).fetchone())
    if not menu:
        menu = dict_from_row(db.execute("SELECT * FROM navigation_menus LIMIT 1").fetchone())

    if not menu:
        return {"success": True, "menus": [], "items": [], "tree": []}

    menus = dicts_from_rows(db.execute("SELECT * FROM navigation_menus ORDER BY id ASC").fetchall())
    items = dicts_from_rows(db.execute("""
        SELECT * FROM navigation_items
        WHERE menu_id = ?
        ORDER BY sort_order ASC, id ASC
    """, (menu["id"],)).fetchall())

    tree = build_menu_tree(items, None)

    return {
        "success": True,
        "active_menu": menu,
        "menus": menus,
        "items": items,
        "tree": tree
    }

@router.post("/items", status_code=status.HTTP_201_CREATED)
def create_nav_item(req: NavItemCreateUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    if not req.title or not req.url:
        raise HTTPException(status_code=400, detail="Title and URL are required.")

    cursor = db.execute("""
        INSERT INTO navigation_items (menu_id, parent_id, title, url, route_type, target, sort_order, is_visible, icon_class, badge_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        req.menu_id,
        req.parent_id,
        req.title.strip(),
        req.url.strip(),
        req.route_type or "internal",
        req.target or "_self",
        req.sort_order or 0,
        req.is_visible if req.is_visible is not None else 1,
        req.icon_class,
        req.badge_text
    ))

    return {
        "success": True,
        "message": "Navigation item created successfully",
        "id": cursor.lastrowid
    }

@router.put("/items/{item_id}")
def update_nav_item(item_id: int, req: NavItemCreateUpdate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    item = dict_from_row(db.execute("SELECT * FROM navigation_items WHERE id = ?", (item_id,)).fetchone())
    if not item:
        raise HTTPException(status_code=404, detail="Navigation item not found")

    if req.parent_id and is_descendant(db, item_id, req.parent_id):
        raise HTTPException(status_code=400, detail="Cannot set parent to item itself or one of its descendants.")

    db.execute("""
        UPDATE navigation_items
        SET parent_id = ?, title = ?, url = ?, route_type = ?, target = ?, sort_order = ?, is_visible = ?, icon_class = ?, badge_text = ?
        WHERE id = ?
    """, (
        req.parent_id,
        req.title.strip(),
        req.url.strip(),
        req.route_type or "internal",
        req.target or "_self",
        req.sort_order if req.sort_order is not None else item["sort_order"],
        req.is_visible if req.is_visible is not None else item["is_visible"],
        req.icon_class,
        req.badge_text,
        item_id
    ))

    return {
        "success": True,
        "message": "Navigation item updated successfully"
    }

@router.post("/reorder")
def reorder_nav_items(req: NavReorderRequest, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    for it in req.items:
        iid = it.get("id")
        parent_id = it.get("parent_id")
        sort_order = it.get("sort_order", 0)
        db.execute("""
            UPDATE navigation_items
            SET parent_id = ?, sort_order = ?
            WHERE id = ?
        """, (parent_id, sort_order, iid))

    return {
        "success": True,
        "message": "Navigation items reordered successfully"
    }

@router.delete("/items/{item_id}")
def delete_nav_item(item_id: int, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    def delete_recursive(iid: int):
        children = db.execute("SELECT id FROM navigation_items WHERE parent_id = ?", (iid,)).fetchall()
        for c in children:
            delete_recursive(c["id"])
        db.execute("DELETE FROM navigation_items WHERE id = ?", (iid,))

    delete_recursive(item_id)

    return {
        "success": True,
        "message": "Navigation item deleted successfully"
    }
