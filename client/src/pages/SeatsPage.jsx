import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Armchair, Star, Gem, Trash2, Eye, Crown } from "lucide-react";
import { seatsApi } from "@/lib/api";
import { NBCard } from "@/components/NBCard";
import { NBButton } from "@/components/NBButton";
import { Badge } from "@/components/Badge";
import { StatPill } from "@/components/StatPill";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/States";

const TYPE_CONFIG = {
  Regular: { color: "bg-nb-accent", badgeColor: "green", icon: Armchair },
  Premium: { color: "bg-nb-accent-2", badgeColor: "blue", icon: Star },
  Recliner: { color: "bg-nb-purple", badgeColor: "purple", icon: Gem },
  VIP: { color: "bg-nb-error", badgeColor: "red", icon: Crown },
};

function AddSeatModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ seat_no: "", seat_type: "Regular", seat_price: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "w-full border-2 border-nb-ink rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-nb-accent/50";
  const labelCls = "block text-xs font-bold uppercase tracking-wide text-nb-ink/60 mb-1";

  const handleSubmit = async () => {
    if (!form.seat_no || !form.seat_price) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      await seatsApi.create({ ...form, seat_price: parseFloat(form.seat_price) });
      toast.success("Seat created!"); onCreated(); onClose();
    } catch (e) { toast.error("Failed: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-sm w-full"
        style={{ boxShadow: "var(--shadow-nb)" }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-display font-bold mb-5">Add New Seat</h2>
        <div className="space-y-4">
          <div><label className={labelCls}>Seat No.</label>
            <input className={inputCls} value={form.seat_no} onChange={e => set("seat_no", e.target.value)} placeholder="e.g. A1" />
          </div>
          <div><label className={labelCls}>Type</label>
            <select className={inputCls} value={form.seat_type} onChange={e => set("seat_type", e.target.value)}>
              <option>Regular</option><option>Premium</option><option>Recliner</option><option>VIP</option>
            </select>
          </div>
          <div><label className={labelCls}>Price (₹)</label>
            <input type="number" className={inputCls} value={form.seat_price} onChange={e => set("seat_price", e.target.value)} placeholder="150" />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <NBButton variant="ghost" onClick={onClose}>Cancel</NBButton>
          <NBButton variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Add Seat"}</NBButton>
        </div>
      </div>
    </div>
  );
}

export default function SeatsPage() {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("All");

  const load = async () => {
    setLoading(true); setError(null);
    try { setSeats(await seatsApi.getAll()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try { await seatsApi.delete(id); toast.success("Seat deleted!"); load(); }
    catch (e) { toast.error("Failed: " + e.message); }
  };

  const filtered = filter === "All" ? seats : seats.filter(s => s.seat_type === filter);
  const regular = seats.filter(s => s.seat_type === "Regular").length;
  const premium = seats.filter(s => s.seat_type === "Premium").length;
  const recliner = seats.filter(s => s.seat_type === "Recliner").length;
  const vip = seats.filter(s => s.seat_type === "VIP").length;
  const avgPrice = seats.length ? `₹${Math.round(seats.reduce((a, s) => a + Number(s.seat_price), 0) / seats.length)}` : "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-nb-ink">Seats</h1>
          <p className="text-nb-ink/60 text-sm mt-1">Seat inventory and pricing</p>
        </div>
        <NBButton variant="primary" size="lg" icon={Plus} onClick={() => setAdding(true)}>Add Seat</NBButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatPill label="Total" value={seats.length} icon={Armchair} color="accent" />
        <StatPill label="Regular" value={regular} icon={Armchair} color="blue" />
        <StatPill label="Premium" value={premium} icon={Star} color="purple" />
        <StatPill label="Recliner" value={recliner} icon={Gem} color="warn" />
        <StatPill label="VIP" value={vip} icon={Crown} color="error" />
      </div>

      <div className="flex gap-2">
        {["All", "Regular", "Premium", "Recliner", "VIP"].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full border-2 border-nb-ink text-sm font-bold transition-all hover:-translate-y-0.5 ${filter === t ? "bg-nb-ink text-white" : "bg-white text-nb-ink"}`}
            style={{ boxShadow: "var(--shadow-nb-sm)" }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> :
       error ? <ErrorState message={error} onRetry={load} /> :
       filtered.length === 0 ? <EmptyState icon={Armchair} title="No seats found" action={<NBButton variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add Seat</NBButton>} /> : (
        <div className="overflow-hidden rounded-2xl border-2 border-nb-ink" style={{ boxShadow: "var(--shadow-nb)" }}>
          <table className="w-full text-sm">
            <thead className="bg-nb-ink text-white">
              <tr>
                {["ID", "Seat No", "Type", "Price", "Special Price", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-display font-bold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((seat, i) => {
                const cfg = TYPE_CONFIG[seat.seat_type] || TYPE_CONFIG["Regular"]; // Fallback if missing
                const IconComp = cfg.icon;
                const specialPrice = seat.reg_seat_price || seat.pre_seat_price || seat.rec_seat_price || seat.vip_seat_price;
                return (
                  <tr key={seat.seat_id} className={`border-t-2 border-nb-ink/10 hover:bg-nb-bg/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-nb-bg/30"}`}>
                    <td className="px-4 py-3 font-mono text-xs text-nb-ink/50">#{seat.seat_id}</td>
                    <td className="px-4 py-3 font-bold font-display">{seat.seat_no}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 border-nb-ink ${cfg.color}`}>
                        <IconComp size={11} /> {seat.seat_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{Number(seat.seat_price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-nb-ink/60">{specialPrice ? `₹${Number(specialPrice).toLocaleString()}` : "—"}</td>
                    <td className="px-4 py-3">
                      <button
                        className="p-1.5 rounded-lg border-2 border-nb-ink/30 hover:border-nb-error hover:bg-nb-error hover:text-white transition-all"
                        onClick={() => handleDelete(seat.seat_id)}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {adding && <AddSeatModal onClose={() => setAdding(false)} onCreated={load} />}
    </div>
  );
}
