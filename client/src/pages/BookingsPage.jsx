import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, CalendarCheck, CheckCircle, Clock, XCircle, Trash2, Eye } from "lucide-react";
import { bookingsApi, customersApi, showsApi } from "@/lib/api";
import { NBButton } from "@/components/NBButton";
import { StatPill } from "@/components/StatPill";
import { Badge } from "@/components/Badge";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/States";

const STATUS_CONFIG = {
  Confirmed: { color: "green", icon: CheckCircle },
  Pending: { color: "yellow", icon: Clock },
  Cancelled: { color: "red", icon: XCircle },
};

function AddBookingModal({ onClose, onCreated }) {
  const [customers, setCustomers] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ cust_id: "", show_id: "", booking_date: new Date().toISOString().split("T")[0], booking_status: "Confirmed" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "w-full border-2 border-nb-ink rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-nb-accent/50";
  const labelCls = "block text-xs font-bold uppercase tracking-wide text-nb-ink/60 mb-1";

  useEffect(() => {
    customersApi.getAll().then(setCustomers).catch(() => {});
    showsApi.getAll().then(setShows).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!form.cust_id || !form.show_id) { toast.error("Select customer and show"); return; }
    setLoading(true);
    try {
      await bookingsApi.create({ ...form, cust_id: parseInt(form.cust_id), show_id: parseInt(form.show_id) });
      toast.success("Booking created!"); onCreated(); onClose();
    } catch (e) { toast.error("Failed: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-sm w-full"
        style={{ boxShadow: "var(--shadow-nb)" }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-display font-bold mb-5">New Booking</h2>
        <div className="space-y-4">
          <div><label className={labelCls}>Customer</label>
            <select className={inputCls} value={form.cust_id} onChange={e => set("cust_id", e.target.value)}>
              <option value="">-- Select Customer --</option>
              {customers.map(c => <option key={c.cust_id} value={c.cust_id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Show</label>
            <select className={inputCls} value={form.show_id} onChange={e => set("show_id", e.target.value)}>
              <option value="">-- Select Show --</option>
              {shows.map(s => <option key={s.show_id} value={s.show_id}>{s.show_name}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Date</label>
            <input type="date" className={inputCls} value={form.booking_date} onChange={e => set("booking_date", e.target.value)} />
          </div>
          <div><label className={labelCls}>Status</label>
            <select className={inputCls} value={form.booking_status} onChange={e => set("booking_status", e.target.value)}>
              <option>Confirmed</option><option>Pending</option><option>Cancelled</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <NBButton variant="ghost" onClick={onClose}>Cancel</NBButton>
          <NBButton variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Book"}</NBButton>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true); setError(null);
    try { setBookings(await bookingsApi.getAll()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try { await bookingsApi.delete(id); toast.success("Booking deleted!"); load(); }
    catch (e) { toast.error("Failed: " + e.message); }
  };

  const handleStatusChange = async (booking, status) => {
    try {
      await bookingsApi.update(booking.booking_id, { ...booking, booking_status: status });
      toast.success(`Status updated to ${status}`); load();
    } catch (e) { toast.error("Failed: " + e.message); }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.booking_status === filter);
  const confirmed = bookings.filter(b => b.booking_status === "Confirmed").length;
  const pending = bookings.filter(b => b.booking_status === "Pending").length;
  const cancelled = bookings.filter(b => b.booking_status === "Cancelled").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-nb-ink">Bookings</h1>
          <p className="text-nb-ink/60 text-sm mt-1">All cinema ticket bookings</p>
        </div>
        <NBButton variant="primary" size="lg" icon={Plus} onClick={() => setAdding(true)}>New Booking</NBButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Total" value={bookings.length} icon={CalendarCheck} color="accent" />
        <StatPill label="Confirmed" value={confirmed} icon={CheckCircle} color="blue" />
        <StatPill label="Pending" value={pending} icon={Clock} color="warn" />
        <StatPill label="Cancelled" value={cancelled} icon={XCircle} color="error" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {[["all","All"], ["Confirmed","Confirmed"], ["Pending","Pending"], ["Cancelled","Cancelled"]].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full border-2 border-nb-ink text-sm font-bold transition-all hover:-translate-y-0.5 ${filter === key ? "bg-nb-ink text-white" : "bg-white text-nb-ink"}`}
            style={{ boxShadow: "var(--shadow-nb-sm)" }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> :
       error ? <ErrorState message={error} onRetry={load} /> :
       filtered.length === 0 ? <EmptyState icon={CalendarCheck} title="No bookings" action={<NBButton variant="primary" icon={Plus} onClick={() => setAdding(true)}>New Booking</NBButton>} /> : (
        <div className="overflow-hidden rounded-2xl border-2 border-nb-ink" style={{ boxShadow: "var(--shadow-nb)" }}>
          <table className="w-full text-sm">
            <thead className="bg-nb-ink text-white">
              <tr>
                {["ID", "Customer", "Show", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-display font-bold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const cfg = STATUS_CONFIG[b.booking_status] || STATUS_CONFIG.Pending;
                const StatusIcon = cfg.icon;
                return (
                  <tr key={b.booking_id} className={`border-t-2 border-nb-ink/10 hover:bg-nb-bg/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-nb-bg/30"}`}>
                    <td className="px-4 py-3 font-mono text-xs text-nb-ink/50">#{b.booking_id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-nb-ink">{b.first_name} {b.last_name}</p>
                      <p className="text-xs text-nb-ink/40">ID #{b.cust_id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-nb-ink line-clamp-1">{b.show_name}</p>
                      <p className="text-xs text-nb-ink/40">{b.show_date ? new Date(b.show_date).toLocaleDateString() : "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-nb-ink/70">{new Date(b.booking_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-2 border-nb-ink ${b.booking_status === "Confirmed" ? "bg-nb-ok text-white" : b.booking_status === "Pending" ? "bg-nb-warn text-nb-ink" : "bg-nb-error text-white"}`}>
                        <StatusIcon size={11} /> {b.booking_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {b.booking_status !== "Confirmed" && (
                          <button className="p-1.5 rounded-lg border border-nb-ok/40 hover:bg-nb-ok hover:text-white transition-all text-nb-ok"
                            onClick={() => handleStatusChange(b, "Confirmed")} title="Confirm">
                            <CheckCircle size={13} />
                          </button>
                        )}
                        {b.booking_status !== "Cancelled" && (
                          <button className="p-1.5 rounded-lg border border-nb-error/40 hover:bg-nb-error hover:text-white transition-all text-nb-error"
                            onClick={() => handleStatusChange(b, "Cancelled")} title="Cancel">
                            <XCircle size={13} />
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg border border-nb-ink/30 hover:bg-nb-ink hover:text-white transition-all"
                          onClick={() => handleDelete(b.booking_id)} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {adding && <AddBookingModal onClose={() => setAdding(false)} onCreated={load} />}
    </div>
  );
}
