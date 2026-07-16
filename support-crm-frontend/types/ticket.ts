export type TicketStatus = "Open" | "In Progress" | "Closed";

export interface Note {
  id: number;
  note_text: string;
  created_at: string;
}

// Matches the exact shape returned by GET /api/tickets
export interface TicketSummary {
  ticket_id: string;
  customer_name: string;
  subject: string;
  status: TicketStatus;
  created_at: string;
}

// Matches the exact shape returned by GET /api/tickets/{ticket_id}
export interface TicketDetail {
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  status: TicketStatus;
  notes: Note[];
  created_at: string;
}