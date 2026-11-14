from pydantic import BaseModel, Field
from typing import Optional, Any, List

class LoginRequest(BaseModel):
    username: str
    password: str

class PortalLoginRequest(BaseModel):
    identifier: str
    password: str
    expectedRole: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class EnquiryRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    course_interested: Optional[str] = None
    message: Optional[str] = None

class EnquiryStatusUpdate(BaseModel):
    status: str

class PageCreateUpdate(BaseModel):
    title: str
    slug: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    status: Optional[str] = "published"
    template: Optional[str] = "standard"
    sort_order: Optional[int] = 0

class SectionCreateUpdate(BaseModel):
    page_id: Optional[int] = None
    section_key: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content_html: Optional[str] = None
    image_url: Optional[str] = None
    button_text: Optional[str] = None
    button_url: Optional[str] = None
    section_type: Optional[str] = "standard"
    sort_order: Optional[int] = 0
    is_visible: Optional[int] = 1
    custom_data: Optional[Any] = None

class SectionsReorderRequest(BaseModel):
    ordered_ids: List[int]

class NavItemCreateUpdate(BaseModel):
    menu_id: int
    parent_id: Optional[int] = None
    title: str
    url: str
    route_type: Optional[str] = "internal"
    target: Optional[str] = "_self"
    sort_order: Optional[int] = 0
    is_visible: Optional[int] = 1
    icon_class: Optional[str] = None
    badge_text: Optional[str] = None

class NavReorderRequest(BaseModel):
    items: List[dict]

class AnnouncementCreateUpdate(BaseModel):
    title: str
    summary: Optional[str] = None
    link_url: Optional[str] = None
    badge_text: Optional[str] = "NEW"
    badge_color: Optional[str] = "#159B62"
    is_flash: Optional[int] = 1
    status: Optional[str] = "published"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    sort_order: Optional[int] = 0

class CustomFieldDefCreate(BaseModel):
    entity_type: str
    field_name: str
    field_key: str
    field_type: str
    validation_rules: Optional[Any] = None
    sort_order: Optional[int] = 0

class CustomFieldValuesSave(BaseModel):
    entity_type: str
    entity_id: int
    values: dict

class AttendanceMarkRecord(BaseModel):
    student_id: int
    status: str
    remarks: Optional[str] = None

class AttendanceMarkRequest(BaseModel):
    department: str
    semester: str
    section: str
    subject_code: str
    subject_name: Optional[str] = ""
    date: str
    records: List[AttendanceMarkRecord]

class MarksRecord(BaseModel):
    student_id: int
    subject_code: str
    subject_name: Optional[str] = ""
    semester: str
    exam_type: str
    max_marks: float
    marks_obtained: float
    grade: Optional[str] = None
    academic_year: Optional[str] = "2025-2026"
    remarks: Optional[str] = None

class AssignmentCreateRequest(BaseModel):
    department: str
    semester: str
    section: str
    subject_code: str
    title: str
    description: Optional[str] = None
    due_date: str
    max_marks: Optional[int] = 10
    attachment_url: Optional[str] = None

class AssignmentSubmitRequest(BaseModel):
    submission_content: Optional[str] = ""
    attachment_url: Optional[str] = None

class NotificationMarkReadRequest(BaseModel):
    notification_id: Optional[int] = None
    all: Optional[bool] = False

class ProfileUpdateRequest(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
