from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.models import TicketStatus

# --- NOTE SCHEMAS ---
class NoteBase(BaseModel):
    note_text: str

class NoteResponse(NoteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- TICKET SCHEMAS ---
# 1. POST /api/tickets -> Incoming Request Body
class TicketCreate(BaseModel):
    customer_name: str
    customer_email: str
    subject: str
    description: str

# 2. POST /api/tickets -> Exact Response Shape required by PDF
class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# 3. GET /api/tickets -> Exact Item Response Shape in array required by PDF
class TicketListResponse(BaseModel):
    ticket_id: str
    customer_name: str
    subject: str
    status: TicketStatus
    created_at: datetime

    class Config:
        from_attributes = True

# 4. GET /api/tickets/{ticket_id} -> Exact Response Shape required by PDF
class TicketDetailResponse(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: TicketStatus
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True

# 5. PUT /api/tickets/{ticket_id} -> Incoming Request Body required by PDF
class TicketUpdatePayload(BaseModel):
    status: Optional[TicketStatus] = None
    notes: Optional[str] = None