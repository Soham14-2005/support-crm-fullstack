"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTicket() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      
      // Routes explicitly to your live production API endpoint
      const baseUrl = "https://support-crm-fullstack-production.up.railway.app";
      const res = await fetch(`${baseUrl}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Server rejected request schema parsing rules.");
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong while executing submission.");
    } finally {
      setSubmitting(false);
    }
  };

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

      {/* Main Panel Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 max-w-3xl mx-auto w-full flex items-center justify-center">
        <div className="w-full bg-slate-950/40 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Create Support Ticket</h1>
            <p className="text-xs text-slate-400 mt-1">Submit a new customer issue directly to the triage system.</p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Customer Name</label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 placeholder:text-slate-500 px-3 py-2.5 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Customer Email</label>
              <input
                type="email"
                required
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 placeholder:text-slate-500 px-3 py-2.5 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Title / Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 placeholder:text-slate-500 px-3 py-2.5 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 placeholder:text-slate-500 px-3 py-2.5 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
              <Link
                href="/"
                className="px-4 py-2 border border-slate-800 text-slate-400 font-semibold rounded-xl hover:bg-slate-900/60 transition-all text-xs flex items-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all text-xs disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}