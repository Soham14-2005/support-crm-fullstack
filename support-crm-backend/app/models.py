import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


# ============================================================
# ENUMS
# ============================================================

class TicketStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    CLOSED = "Closed"


# ============================================================
# TICKET MODEL
# ============================================================

class Ticket(Base):
    __tablename__ = "tickets"

    # Internal database primary key
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Public-facing ticket ID
    # Example: TKT-001, TKT-002
    ticket_id = Column(
        String(20),
        unique=True,
        nullable=False,
        index=True
    )

    customer_name = Column(
        String(100),
        nullable=False
    )

    customer_email = Column(
        String(255),
        nullable=False
    )

    subject = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    # Maps Python TicketStatus enum values to the existing
    # PostgreSQL ticket_status enum:
    # "Open", "In Progress", "Closed"
    status = Column(
        SQLEnum(
            TicketStatus,
            name="ticket_status",
            values_callable=lambda enum_class: [
                member.value for member in enum_class
            ]
        ),
        nullable=False,
        default=TicketStatus.OPEN
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # One Ticket -> Many Notes
    notes = relationship(
        "Note",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )


# ============================================================
# NOTE MODEL
# ============================================================

class Note(Base):
    __tablename__ = "notes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Foreign key referencing the internal tickets.id
    ticket_id = Column(
        Integer,
        ForeignKey(
            "tickets.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    note_text = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Many Notes -> One Ticket
    ticket = relationship(
        "Ticket",
        back_populates="notes"
    )