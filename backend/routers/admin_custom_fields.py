import json
import sqlite3
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.database import get_db, dict_from_row, dicts_from_rows
from backend.auth import require_admin
from backend.models.schemas import CustomFieldDefCreate, CustomFieldValuesSave

router = APIRouter(prefix="/admin/custom-fields", tags=["Admin Custom Fields"])

SUPPORTED_TYPES = ["text", "textarea", "rich_text", "image", "url", "date", "number", "boolean"]

@router.get("/definitions")
def get_custom_field_definitions(entity_type: Optional[str] = Query(None), current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    query = "SELECT * FROM custom_field_definitions"
    params = []
    if entity_type:
        query += " WHERE entity_type = ?"
        params.append(entity_type)
    query += " ORDER BY sort_order ASC, id ASC"

    rows = db.execute(query, params).fetchall()
    definitions = []
    for r in rows:
        d = dict(r)
        if d.get("validation_rules"):
            try:
                d["validation_rules"] = json.loads(d["validation_rules"])
            except Exception:
                d["validation_rules"] = {}
        else:
            d["validation_rules"] = {}
        definitions.append(d)

    return {
        "success": True,
        "supported_types": SUPPORTED_TYPES,
        "definitions": definitions
    }

@router.post("/definitions", status_code=status.HTTP_201_CREATED)
def create_custom_field_definition(req: CustomFieldDefCreate, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    if req.field_type not in SUPPORTED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported field type. Allowed: {SUPPORTED_TYPES}")

    field_key = req.field_key.strip().lower()
    existing = db.execute("SELECT id FROM custom_field_definitions WHERE field_key = ?", (field_key,)).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail=f"Field key '{field_key}' already exists.")

    rules_str = json.dumps(req.validation_rules) if req.validation_rules is not None else "{}"

    cursor = db.execute("""
        INSERT INTO custom_field_definitions (entity_type, field_name, field_key, field_type, validation_rules, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        req.entity_type.strip(),
        req.field_name.strip(),
        field_key,
        req.field_type,
        rules_str,
        req.sort_order or 0
    ))

    return {
        "success": True,
        "message": "Custom field definition created",
        "id": cursor.lastrowid
    }

@router.get("/values")
def get_custom_field_values(entity_type: str = Query(...), entity_id: int = Query(...), current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    rows = db.execute("""
        SELECT cfd.field_key, cfd.field_type, cfv.field_value
        FROM custom_field_values cfv
        JOIN custom_field_definitions cfd ON cfd.id = cfv.field_definition_id
        WHERE cfv.entity_type = ? AND cfv.entity_id = ?
    """, (entity_type, entity_id)).fetchall()

    values = {r["field_key"]: r["field_value"] for r in rows}

    return {
        "success": True,
        "entity_type": entity_type,
        "entity_id": entity_id,
        "values": values
    }

@router.put("/values")
def save_custom_field_values(req: CustomFieldValuesSave, current_user: dict = Depends(require_admin), db: sqlite3.Connection = Depends(get_db)):
    definitions = db.execute("""
        SELECT id, field_key, field_type
        FROM custom_field_definitions
        WHERE entity_type = ?
    """, (req.entity_type,)).fetchall()

    def_map = {d["field_key"]: d["id"] for d in definitions}

    for key, val in req.values.items():
        if key in def_map:
            def_id = def_map[key]
            str_val = str(val) if val is not None else ""
            db.execute("""
                INSERT INTO custom_field_values (entity_type, entity_id, field_definition_id, field_value)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(entity_type, entity_id, field_definition_id)
                DO UPDATE SET field_value = excluded.field_value, updated_at = CURRENT_TIMESTAMP
            """, (req.entity_type, req.entity_id, def_id, str_val))

    return {
        "success": True,
        "message": "Custom field values updated successfully"
    }
