from sqlalchemy.orm import Session
from sqlalchemy import func, or_
import re
from app import models, schemas

def generate_next_ticket_id(db: Session) -> str:
    """
    Looks at the highest existing TKT-XXX string in the database and increments it.
    Defaults to TKT-001 if the table is empty.
    """
    max_id = db.query(func.max(models.Ticket.ticket_id)).scalar()
    
    if not max_id:
        return "TKT-001"
    
    match = re.search(r"TKT-(\d+)", str(max_id))
    if match:
        next_number = int(match.group(1)) + 1
        return f"TKT-{next_number:03d}"
        
    return "TKT-001"

def create_ticket(db: Session, ticket_in: schemas.TicketCreate):
    new_ticket_id = generate_next_ticket_id(db)
    
    db_ticket = models.Ticket(
        ticket_id=new_ticket_id,
        customer_name=ticket_in.customer_name,
        customer_email=ticket_in.customer_email,
        subject=ticket_in.subject,
        description=ticket_in.description,
        status=models.TicketStatus.OPEN
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_tickets(db: Session, status: str = None, search: str = None):
    query = db.query(models.Ticket)
    
    if status:
        query = query.filter(models.Ticket.status == status)
        
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                models.Ticket.ticket_id.ilike(search_filter),
                models.Ticket.customer_name.ilike(search_filter),
                models.Ticket.customer_email.ilike(search_filter),
                models.Ticket.subject.ilike(search_filter),
                models.Ticket.description.ilike(search_filter)
            )
        )
    return query.all()

def get_ticket_by_public_id(db: Session, ticket_id: str):
    return db.query(models.Ticket).filter(models.Ticket.ticket_id == ticket_id).first()

def update_ticket_status_and_add_note(db: Session, ticket_id: str, status_update: str = None, note_text: str = None):
    db_ticket = get_ticket_by_public_id(db, ticket_id)
    if not db_ticket:
        return None
        
    if status_update:
        db_ticket.status = status_update
        
    if note_text:
        new_note = models.Note(
            ticket_id=db_ticket.id,
            note_text=note_text
        )
        db.add(new_note)
        
    db.commit()
    db.refresh(db_ticket)
    return db_ticket