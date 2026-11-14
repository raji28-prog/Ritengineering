import json
import sqlite3
from datetime import datetime, timezone
from typing import Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.models.schemas import EnquiryRequest

router = APIRouter(prefix="/public", tags=["Public"])

def build_menu_tree(items: list[dict], parent_id: Optional[int] = None) -> list[dict]:
    branch = []
    for item in items:
        if item.get("parent_id") == parent_id:
            children = build_menu_tree(items, item["id"])
            branch.append({**item, "children": children})
    return branch

@router.get("/homepage")
def get_homepage(db: sqlite3.Connection = Depends(get_db)):
    home_page = dict_from_row(db.execute('SELECT id, title, meta_title, meta_description FROM pages WHERE slug = "home"').fetchone())
    page_id = home_page["id"] if home_page else None

    sections_rows = db.execute("""
        SELECT id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, custom_data
        FROM content_sections
        WHERE (page_id = ? OR page_id IS NULL) AND is_visible = 1
        ORDER BY sort_order ASC, id ASC
    """, (page_id,)).fetchall()

    hero_slides = []
    counters = []
    why_ritw = []
    testimonials = []
    spotlight = []
    custom_sections = []

    for row in sections_rows:
        s = dict(row)
        if s.get("custom_data"):
            try:
                s["custom_data"] = json.loads(s["custom_data"])
            except Exception:
                s["custom_data"] = {}
        else:
            s["custom_data"] = {}

        stype = s.get("section_type")
        if stype == "hero_slide":
            hero_slides.append(s)
        elif stype == "counter":
            counters.append(s)
        elif stype == "why_ritw":
            why_ritw.append(s)
        elif stype == "testimonial":
            testimonials.append(s)
        elif stype == "spotlight":
            spotlight.append(s)
        else:
            custom_sections.append(s)

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    announcements_rows = db.execute("""
        SELECT id, title, summary, link_url, badge_text, badge_color, is_flash
        FROM announcements_news
        WHERE status = 'published'
          AND (start_date IS NULL OR start_date <= ?)
          AND (end_date IS NULL OR end_date >= ?)
        ORDER BY sort_order ASC, id DESC
    """, (now, now)).fetchall()

    def get_setting(key: str, default: Any = None):
        row = db.execute("SELECT value FROM college_settings WHERE key = ?", (key,)).fetchone()
        if not row:
            return default
        val = row["value"]
        try:
            return json.loads(val)
        except Exception:
            return val

    return {
        "success": True,
        "homepage": {
            "page": home_page,
            "hero_slides": hero_slides,
            "announcements": dicts_from_rows(announcements_rows),
            "counters": counters,
            "why_ritw": why_ritw,
            "testimonials": testimonials,
            "spotlight": spotlight,
            "custom_sections": custom_sections,
            "college_info": get_setting("general", {}),
            "contact": get_setting("contact", {}),
            "social": get_setting("social", {}),
            "accreditations": get_setting("accreditations", []),
            "features": get_setting("features", {})
        }
    }

@router.get("/pages/{slug}")
def get_public_page(slug: str, db: sqlite3.Connection = Depends(get_db)):
    clean_slug = slug.strip().lower()
    page = dict_from_row(db.execute("""
        SELECT id, title, slug, meta_title, meta_description, template, published_at, updated_at
        FROM pages
        WHERE slug = ? AND status = 'published'
    """, (clean_slug,)).fetchone())

    if not page:
        raise HTTPException(status_code=404, detail=f"Page not found: {clean_slug}")

    sections_rows = db.execute("""
        SELECT id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, custom_data
        FROM content_sections
        WHERE page_id = ? AND is_visible = 1
        ORDER BY sort_order ASC
    """, (page["id"],)).fetchall()

    sections = []
    for r in sections_rows:
        s = dict(r)
        if s.get("custom_data"):
            try:
                s["custom_data"] = json.loads(s["custom_data"])
            except Exception:
                s["custom_data"] = {}
        else:
            s["custom_data"] = {}
        sections.append(s)

    cf_rows = db.execute("""
        SELECT cfd.field_key, cfd.field_type, cfv.field_value
        FROM custom_field_values cfv
        JOIN custom_field_definitions cfd ON cfd.id = cfv.field_definition_id
        WHERE cfv.entity_type = 'page' AND cfv.entity_id = ?
    """, (page["id"],)).fetchall()

    custom_field_map = {row["field_key"]: row["field_value"] for row in cf_rows}

    return {
        "success": True,
        "page": {
            **page,
            "sections": sections,
            "custom_fields": custom_field_map
        }
    }

@router.get("/navigation")
def get_public_navigation(menu_key: str = Query("main_header"), db: sqlite3.Connection = Depends(get_db)):
    menu = dict_from_row(db.execute("SELECT id, menu_key, title FROM navigation_menus WHERE menu_key = ?", (menu_key,)).fetchone())
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")

    items_rows = db.execute("""
        SELECT id, parent_id, title, url, route_type, target, sort_order, icon_class, badge_text
        FROM navigation_items
        WHERE menu_id = ? AND is_visible = 1
        ORDER BY sort_order ASC, id ASC
    """, (menu["id"],)).fetchall()

    items = dicts_from_rows(items_rows)
    tree = build_menu_tree(items, None)

    return {
        "success": True,
        "menu_key": menu["menu_key"],
        "menu_title": menu["title"],
        "tree": tree
    }

@router.get("/announcements")
def get_public_announcements(db: sqlite3.Connection = Depends(get_db)):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    items_rows = db.execute("""
        SELECT id, title, summary, link_url, badge_text, badge_color, is_flash, start_date, end_date
        FROM announcements_news
        WHERE status = 'published'
          AND (start_date IS NULL OR start_date <= ?)
          AND (end_date IS NULL OR end_date >= ?)
        ORDER BY sort_order ASC, id DESC
    """, (now, now)).fetchall()

    return {
        "success": True,
        "announcements": dicts_from_rows(items_rows)
    }

@router.get("/settings/college")
def get_public_college_settings(db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("SELECT key, value, category FROM college_settings").fetchall()
    settings = {}
    for r in rows:
        val = r["value"]
        try:
            settings[r["key"]] = json.loads(val)
        except Exception:
            settings[r["key"]] = val

    return {
        "success": True,
        "settings": settings
    }

@router.post("/enquiry", status_code=status.HTTP_201_CREATED)
def submit_admission_enquiry(req: EnquiryRequest, request: Request, db: sqlite3.Connection = Depends(get_db)):
    if not req.full_name or not req.email or not req.phone:
        raise HTTPException(status_code=400, detail="Full name, email, and mobile phone number are required.")

    ip = request.client.host if request.client else "unknown"

    cursor = db.execute("""
        INSERT INTO admission_enquiries (full_name, email, phone, course_interested, message, status, ip_address)
        VALUES (?, ?, ?, ?, ?, 'new', ?)
    """, (
        req.full_name.strip(),
        req.email.strip(),
        req.phone.strip(),
        req.course_interested.strip() if req.course_interested else None,
        req.message.strip() if req.message else None,
        ip
    ))

    return {
        "success": True,
        "message": "Thank you! Your admission enquiry has been submitted. Our admissions coordinator will contact you shortly.",
        "enquiry_id": cursor.lastrowid
    }
