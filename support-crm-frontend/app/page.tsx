"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TicketSummary } from "@/types/ticket";

export default function Dashboard() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (statusFilter) queryParams.append("status", statusFilter);
        if (search) queryParams.append("search", search);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/api/tickets?${queryParams.toString()}`);
        
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        }
      } catch (err) {
        console.error("Error communicating with ticket API:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchTickets();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, mounted]);

  // Pure client-side dynamic data export utility
  const exportToCSV = () => {
    if (tickets.length === 0) return;
    const headers = "Ticket ID,Customer Name,Title,Status,Date\n";
    const rows = tickets
      .map(
        (t) =>
          `${t.ticket_id},"${t.customer_name}","${t.subject}",${t.status},${new Date(
            t.created_at
          ).toLocaleDateString()}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StrawDesk_CRM_Export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const metrics = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    closed: tickets.filter((t) => t.status === "Closed").length,
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
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 font-medium text-sm transition-all border border-blue-500/15">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </Link>
        </nav>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-xs font-medium text-slate-400">Intern Review MVP</p>
          <span className="inline-block mt-2 text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 font-mono">v1.1.0</span>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Topbar Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Support CRM</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage customer relationship tickets efficiently.</p>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={tickets.length === 0}
              className="flex-1 sm:flex-none text-center border border-slate-800 bg-slate-900 hover:bg-slate-800/80 text-slate-300 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Export to CSV
            </button>
            <Link
              href="/new-ticket"
              className="flex-1 sm:w-auto text-center bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
            >
              Create Ticket
            </Link>
          </div>
        </header>

        {/* Analytics Card Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            { label: "Total Tickets", count: metrics.total, style: "from-slate-800/40 to-slate-900/40 border-slate-800 text-slate-300" },
            { label: "Open Status", count: metrics.open, style: "from-emerald-950/20 to-emerald-900/10 border-emerald-500/20 text-emerald-400" },
            { label: "In Progress", count: metrics.inProgress, style: "from-amber-950/20 to-amber-900/10 border-amber-500/20 text-amber-400" },
            { label: "Closed Status", count: metrics.closed, style: "from-blue-950/20 to-blue-900/10 border-blue-500/20 text-blue-400" },
          ].map((m, i) => (
            <div key={i} className={`p-5 rounded-2xl border bg-gradient-to-br shadow-xs relative overflow-hidden group ${m.style}`}>
              <div className="absolute top-0 right-0 h-16 w-16 bg-white/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400/80">{m.label}</p>
              <p className="text-3xl sm:text-4xl font-black tracking-tight mt-2">{m.count}</p>
            </div>
          ))}
        </div>

        {/* Filters and Searching System */}
        <div className="flex flex-col sm:flex-row gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          {mounted ? (
            <>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search across IDs, names, emails, and descriptions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 placeholder:text-slate-500 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                />
                <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900/60 border border-slate-800 text-slate-200 px-4 py-2.5 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all cursor-pointer min-w-[150px]"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </>
          ) : (
            <div className="h-11 w-full bg-slate-900/40 rounded-xl animate-pulse" />
          )}
        </div>

        {/* Ticket List Table */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900/40 border-b border-slate-800 font-semibold text-slate-400 tracking-wide select-none">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {!mounted || loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Querying system log registries...
                      </div>
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                      No matching operational logs located.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.ticket_id} className="hover:bg-slate-900/20 transition-colors group">
                      <td className="p-4 pl-6 font-bold text-blue-400">
                        <Link href={`/ticket/${t.ticket_id}`} className="hover:text-blue-300 hover:underline">
                          {t.ticket_id}
                        </Link>
                      </td>
                      <td className="p-4 font-semibold text-slate-200">{t.customer_name}</td>
                      <td className="p-4 text-slate-400 max-w-xs sm:max-w-md truncate">{t.subject}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border tracking-wide shadow-xs ${
                            t.status === "Open"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : t.status === "In Progress"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-slate-500 font-medium">
                        {new Date(t.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}