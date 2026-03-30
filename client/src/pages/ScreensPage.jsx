import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Monitor, Tv2, Zap, Box, Square, Trash2, Eye, Sofa } from "lucide-react";
import { screensApi } from "@/lib/api";
import { NBCard } from "@/components/NBCard";
import { NBButton } from "@/components/NBButton";
import { Badge } from "@/components/Badge";
import { StatPill } from "@/components/StatPill";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/States";

function getScreenType(screen) {
  if (screen.imax_manufacturer) return "IMAX";
  if (screen.s4d_manufacturer) return "4D";
  if (screen.s3d_manufacturer) return "3D";
  if (screen.s2d_manufacturer) return "2D";
  return "Standard";
}

const TYPE_CONFIG = {
  IMAX: { color: "bg-nb-ink text-white", badgeColor: "gray", icon: Tv2 },
  "4D": { color: "bg-nb-error text-white", badgeColor: "red", icon: Zap },
  "3D": { color: "bg-nb-accent-2 text-nb-ink", badgeColor: "blue", icon: Box },
  "2D": { color: "bg-nb-accent text-nb-ink", badgeColor: "green", icon: Square },
  Standard: { color: "bg-gray-200 text-nb-ink", badgeColor: "gray", icon: Monitor },
};

function ScreenModal({ screen, onClose, onDelete }) {
  const type = getScreenType(screen);
  const cfg = TYPE_CONFIG[type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-lg w-full"
        style={{ boxShadow: "var(--shadow-nb)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 ${cfg.color} border-2 border-nb-ink rounded-xl flex items-center justify-center`}>
            <cfg.icon size={22} />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">Screen #{screen.screen_no}</h2>
            <Badge color={cfg.badgeColor}>{type}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <Info label="Size" value={screen.screen_size} />
          <Info label="Status" value={screen.screen_status} />
          <Info label="Seat Count" value={screen.seat_count?.toString()} />
          {screen.imax_manufacturer && <><Info label="Manufacturer" value={screen.imax_manufacturer} /><Info label="Sound" value={screen.imax_sound_system} /><Info label="Projector" value={screen.imax_projector_type} /></>}
          {screen.s4d_manufacturer && <><Info label="Manufacturer" value={screen.s4d_manufacturer} /><Info label="Sound" value={screen.s4d_sound_system} /></>}
          {screen.s3d_manufacturer && <><Info label="Manufacturer" value={screen.s3d_manufacturer} /><Info label="Sound" value={screen.s3d_sound_system} /></>}
          {screen.s2d_manufacturer && <><Info label="Manufacturer" value={screen.s2d_manufacturer} /><Info label="Projector" value={screen.s2d_projector_type} /></>}
        </div>
        <div className="flex gap-3 justify-end">
          <NBButton variant="ghost" onClick={onClose}>Close</NBButton>
          <NBButton variant="danger" icon={Trash2} onClick={() => onDelete(screen.screen_no)}>Delete</NBButton>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-nb-ink/50 font-semibold uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-nb-ink">{value || "—"}</p>
    </div>
  );
}

function AddScreenModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    screen_size: "Large", screen_status: "Active", seat_count: "", screen_type: "IMAX",
    imax_manufacturer: "", imax_sound_system: "", imax_projector_type: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "w-full border-2 border-nb-ink rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-nb-accent/50";
  const labelCls = "block text-xs font-bold uppercase tracking-wide text-nb-ink/60 mb-1";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await screensApi.create({ ...form, seat_count: parseInt(form.seat_count) || 0 });
      toast.success("Screen created!");
      onCreated(); onClose();
    } catch (e) { toast.error("Failed: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-md w-full"
        style={{ boxShadow: "var(--shadow-nb)" }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-display font-bold mb-5">Add New Screen</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Size</label>
              <select className={inputCls} value={form.screen_size} onChange={e => set("screen_size", e.target.value)}>
                {["Small","Medium","Large","XL"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Status</label>
              <select className={inputCls} value={form.screen_status} onChange={e => set("screen_status", e.target.value)}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Seat Count</label>
            <input type="number" className={inputCls} value={form.seat_count} onChange={e => set("seat_count", e.target.value)} placeholder="120" />
          </div>
          <div><label className={labelCls}>Screen Type</label>
            <select className={inputCls} value={form.screen_type} onChange={e => set("screen_type", e.target.value)}>
              <option value="IMAX">IMAX</option><option value="4D">4D</option><option value="3D">3D</option><option value="2D">2D</option>
            </select>
          </div>
          <div><label className={labelCls}>Manufacturer</label>
            <input className={inputCls} value={form.imax_manufacturer} onChange={e => set("imax_manufacturer", e.target.value)} placeholder="e.g. IMAX Corporation" />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <NBButton variant="ghost" onClick={onClose}>Cancel</NBButton>
          <NBButton variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Create Screen"}</NBButton>
        </div>
      </div>
    </div>
  );
}

export default function ScreensPage() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try { setScreens(await screensApi.getAll()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try { await screensApi.delete(id); toast.success("Screen deleted!"); setSelected(null); load(); }
    catch (e) { toast.error("Failed: " + e.message); }
  };

  const active = screens.filter(s => s.screen_status === "Active").length;
  const totalSeats = screens.reduce((a, s) => a + (s.seat_count || 0), 0);
  const imax = screens.filter(s => s.imax_manufacturer).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-nb-ink">Screens</h1>
          <p className="text-nb-ink/60 text-sm mt-1">Screening rooms and configurations</p>
        </div>
        <NBButton variant="primary" size="lg" icon={Plus} onClick={() => setAdding(true)}>Add Screen</NBButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Total" value={screens.length} icon={Monitor} color="accent" />
        <StatPill label="Active" value={active} icon={Tv2} color="blue" />
        <StatPill label="IMAX" value={imax} icon={Zap} color="purple" />
        <StatPill label="Total Seats" value={totalSeats} icon={Sofa} color="warn" />
      </div>

      {loading ? <LoadingSpinner /> :
       error ? <ErrorState message={error} onRetry={load} /> :
       screens.length === 0 ? <EmptyState icon={Monitor} title="No screens" description="Add a screening room." action={<NBButton variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add Screen</NBButton>} /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {screens.map(screen => {
            const type = getScreenType(screen);
            const cfg = TYPE_CONFIG[type];
            const IconComp = cfg.icon;
            return (
              <NBCard key={screen.screen_no}
                className="group cursor-pointer hover:-translate-y-1 transition-all duration-200"
                style={{ boxShadow: "var(--shadow-nb)" }}
                onClick={() => setSelected(screen)}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${cfg.color} border-2 border-nb-ink rounded-xl flex items-center justify-center`}>
                    <IconComp size={22} />
                  </div>
                  <div className="text-right">
                    <Badge color={screen.screen_status === "Active" ? "green" : "gray"}>{screen.screen_status}</Badge>
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-nb-ink">Screen #{screen.screen_no}</h3>
                <p className="text-sm text-nb-ink/60 mb-3">{screen.screen_size} · {screen.seat_count} seats</p>
                <Badge color={cfg.badgeColor}>{type}</Badge>
                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 py-1.5 border-2 border-nb-ink rounded-lg text-xs font-bold bg-nb-bg hover:bg-nb-accent transition-colors flex items-center justify-center gap-1"
                    onClick={e => { e.stopPropagation(); setSelected(screen); }}>
                    <Eye size={12} /> Details
                  </button>
                  <button className="flex-1 py-1.5 border-2 border-nb-ink rounded-lg text-xs font-bold bg-nb-bg hover:bg-nb-error hover:text-white transition-colors flex items-center justify-center gap-1"
                    onClick={e => { e.stopPropagation(); handleDelete(screen.screen_no); }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </NBCard>
            );
          })}
        </div>
      )}

      {selected && <ScreenModal screen={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />}
      {adding && <AddScreenModal onClose={() => setAdding(false)} onCreated={load} />}
    </div>
  );
}
