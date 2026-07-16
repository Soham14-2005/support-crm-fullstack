"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { TicketDetail } from "@/types/ticket";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/tickets/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
        setStatusUpdate(data.status);
      }
    } catch (err) {
      console.error("Network error fetching details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    try {
      setSubmitting(true);
      setMessage("");

      const res = await fetch(`${baseUrl}/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusUpdate,
          notes: newNote.trim() || null,
        }),
      });

      if (res.ok) {
        setMessage("Ticket updated successfully!");
        setNewNote("");
        await fetchTicketDetails();
      } else {
        setMessage("Failed to submit updates.");
      }
    } catch (err) {
      console.error("Error running update:", err);
      setMessage("An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  // Macro quick action template handler
  const applyTemplate = (text: string) => {
    setNewNote(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center font-sans">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading comprehensive ticket logs...
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex flex-col items-center justify-center font-sans p-8 text-center">
        <p className="text-red-400 font-semibold">Ticket {ticketId} was not found in the CRM registry.</p>
        <Link href="/" className="text-blue-400 hover:underline text-sm mt-4 inline-block">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 p-6 space-y-8 shrink-0">
        <div className="flex items-center gap-2.5 px-2">
          <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white tracking-wider shadow-lg shadow-blue-500/20">
            DS
          </div>
          <div>
            <span className="font-bold tracking-tight text-white block text-sm">StrawDesk</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Support Portal</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-medium text-sm transition-all hover:bg-slate-900/60">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </Link>
        </nav>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header Row */}
        <div className="flex justify-between items-center bg-slate-950/40 p-4 border border-slate-800 rounded-2xl backdrop-blur-md">
          <Link href="/" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Dashboard
          </Link>
          <span className={`inline-flex items-center px-3 py-0.5 rounded-md text-xs font-bold border tracking-wide shadow-xs ${
            ticket.status === "Open" 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : ticket.status === "In Progress" 
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
              : "bg-slate-800 text-slate-400 border-slate-700"
          }`}>
            {ticket.status}
          </span>
        </div>

        {/* Structural Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Core Ticket Context Info */}
          <div className="lg:col-span-2 bg-slate-950/40 border border-slate-800/80 rounded-2xl backdrop-blur-md p-6 space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ticket Reference</span>
              <h1 className="text-3xl font-black tracking-tight text-white mt-1">{ticket.ticket_id}</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-slate-800/60 py-4 text-sm">
              <div>
                <p className="font-semibold text-slate-500">Customer Name</p>
                <p className="text-slate-200 font-medium mt-1">{ticket.customer_name}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-500">Customer Email</p>
                <p className="text-slate-200 font-medium mt-1">{ticket.customer_email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">{ticket.subject}</h2>
              <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Action Panels */}
          <div className="space-y-6">
            {/* Control Panel Form Box */}
            <form onSubmit={handleUpdate} className="bg-slate-950/40 border border-slate-800/80 rounded-2xl backdrop-blur-md p-6 space-y-4 text-sm shadow-xl">
              <h3 className="font-bold text-white text-base tracking-tight">Update Ticket Control</h3>
              
              {message && (
                <div className="p-2.5 text-xs font-semibold rounded-xl text-blue-400 bg-blue-950/30 border border-blue-900/40">
                  {message}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Modify Status</label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 text-slate-200 px-3 py-2.5 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Add Internal Note</label>
                <textarea
                  rows={3}
                  placeholder="Type updates or customer interaction summaries..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 placeholder:text-slate-600 px-3 py-2.5 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 resize-none"
                />
                
                {/* Micro Action Template Macro Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => applyTemplate("Requested core backend diagnostic logging files from user.")}
                    className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded-md border border-slate-800 hover:text-slate-200 transition-colors"
                  >
                    + Request Logs
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("Escalated ticket records directly to engineering tier for system audit.")}
                    className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded-md border border-slate-800 hover:text-slate-200 transition-colors"
                  >
                    + Escalate
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Save Updates"}
              </button>
            </form>

            {/* Relational Notes History Feed Panel with Audit Metadata Indicators */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl backdrop-blur-md p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                <h3 className="font-bold text-white text-base tracking-tight">Activity Logs</h3>
                <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md font-mono font-semibold">
                  {ticket.notes.length} Total Updates
                </span>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {ticket.notes.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No internal notes logged on this case yet.</p>
                ) : (
                  ticket.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-1 text-xs">
                      <p className="text-slate-300 leading-relaxed">{note.note_text}</p>
                      <p className="text-[10px] text-slate-500 text-right font-medium mt-1">
                        {new Date(note.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}