from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app import schemas, crud
# Importing the correct uppercase ENGINE variable from your database config
from app.database import get_db, Base, ENGINE

# Automatically spawn tables on the live database using your exact connection engine
Base.metadata.create_all(bind=ENGINE)

app = FastAPI(title="Support CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    from sqlalchemy.sql import text
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.post("/api/tickets", response_model=schemas.TicketCreateResponse, status_code=status.HTTP_201_CREATED)
def create_new_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_ticket(db=db, ticket_in=ticket)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tickets", response_model=List[schemas.TicketListResponse])
def read_tickets(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        return crud.get_tickets(db, status=status, search=search)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tickets/{ticket_id}", response_model=schemas.TicketDetailResponse)
def read_ticket_detail(ticket_id: str, db: Session = Depends(get_db)):
    db_ticket = crud.get_ticket_by_public_id(db, ticket_id=ticket_id)
    if not db_ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return db_ticket

@app.put("/api/tickets/{ticket_id}")
def update_ticket(ticket_id: str, payload: schemas.TicketUpdatePayload, db: Session = Depends(get_db)):
    updated_ticket = crud.update_ticket_status_and_add_note(
        db, 
        ticket_id=ticket_id, 
        status_update=payload.status, 
        note_text=payload.notes
    )
    
    if not updated_ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
        
    return {
        "success": True, 
        "updated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    }