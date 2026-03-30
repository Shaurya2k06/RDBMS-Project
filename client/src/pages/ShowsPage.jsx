import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Clapperboard, Film, FileText, Radio, Trash2, Edit2, Eye } from "lucide-react";
import { showsApi } from "@/lib/api";
import { NBCard } from "@/components/NBCard";
import { NBButton } from "@/components/NBButton";
import { Badge } from "@/components/Badge";
import { StatPill } from "@/components/StatPill";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/States";

const TYPE_COLOR = {
  movie: "blue",
  documentary: "green",
  live: "yellow",
};

const TYPE_LABEL = {
  movie: "Movie",
  documentary: "Documentary",
  live: "Live Screening",
};

function getShowType(show) {
  if (show.genre !== undefined && show.genre !== null) return "movie";
  if (show.dreviews !== undefined && show.dreviews !== null) return "documentary";
  if (show.lreviews !== undefined && show.lreviews !== null) return "live";
  return "unknown";
}

function TypeIcon({ type }) {
  if (type === "movie") return <Film size={14} />;
  if (type === "documentary") return <FileText size={14} />;
  return <Radio size={14} />;
}

function ShowModal({ show, onClose, onDelete }) {
  const type = getShowType(show);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-lg w-full"
        style={{ boxShadow: "var(--shadow-nb)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold">{show.show_name}</h2>
          <Badge color={TYPE_COLOR[type]}>{TYPE_LABEL[type]}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mb-6">
          <Info label="Date" value={new Date(show.show_date).toLocaleDateString()} />
          <Info label="Duration" value={`${show.show_duration} min`} />
          <Info label="Language" value={show.show_language} />
          <Info label="Rating" value={show.rating_type || "—"} />
          {type === "movie" && <><Info label="Genre" value={show.genre} /><Info label="Age Rating" value={show.m_age_rating || "—"} /></>}
          {type === "documentary" && <Info label="Age Rating" value={show.d_age_rating || "—"} />}
          {type === "live" && <Info label="Age Rating" value={show.l_age_rating || "—"} />}
        </div>
        <div className="flex gap-3 justify-end">
          <NBButton variant="ghost" onClick={onClose}>Close</NBButton>
          <NBButton variant="danger" icon={Trash2} onClick={() => onDelete(show.show_id)}>Delete</NBButton>
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

function AddShowModal({ onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    show_name: "", show_date: "", show_duration: "", show_language: "English",
    rating_type: "PG-13", show_type: "Movie",
    genre: "", age_rating: "PG-13", accessibility: "Subtitles available", mreviews: "",
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        show_name: form.show_name,
        show_date: form.show_date,
        show_duration: parseInt(form.show_duration),
        show_language: form.show_language,
        rating_type: form.rating_type,
        show_type: form.show_type,
        ...(form.show_type === "Movie" ? { genre: form.genre, mreviews: form.mreviews, age_rating: form.age_rating, accessibility: form.accessibility } : {}),
        ...(form.show_type === "Documentary" ? { dreviews: form.mreviews, age_rating: form.age_rating, accessibility: form.accessibility } : {}),
        ...(form.show_type === "LiveScreening" ? { lreviews: form.mreviews, age_rating: form.age_rating, accessibility: form.accessibility } : {}),
      };
      await showsApi.create(payload);
      toast.success("Show created successfully!");
      onCreated();
      onClose();
    } catch (e) {
      toast.error("Failed to create show: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border-2 border-nb-ink rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-nb-accent/50";
  const labelCls = "block text-xs font-bold uppercase tracking-wide text-nb-ink/60 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "var(--shadow-nb)" }}
        onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-display font-bold mb-5">Add New Show</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Show Name</label>
            <input className={inputCls} value={form.show_name} onChange={e => set("show_name", e.target.value)} placeholder="e.g. Inception" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} value={form.show_date} onChange={e => set("show_date", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Duration (min)</label>
              <input type="number" className={inputCls} value={form.show_duration} onChange={e => set("show_duration", e.target.value)} placeholder="120" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Language</label>
              <input className={inputCls} value={form.show_language} onChange={e => set("show_language", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.show_type} onChange={e => set("show_type", e.target.value)}>
                <option value="Movie">Movie</option>
                <option value="Documentary">Documentary</option>
                <option value="LiveScreening">Live Screening</option>
              </select>
            </div>
          </div>
          {form.show_type === "Movie" && (
            <div>
              <label className={labelCls}>Genre</label>
              <input className={inputCls} value={form.genre} onChange={e => set("genre", e.target.value)} placeholder="Action, Sci-Fi, Drama..." />
            </div>
          )}
          <div>
            <label className={labelCls}>Age Rating</label>
            <select className={inputCls} value={form.age_rating} onChange={e => set("age_rating", e.target.value)}>
              <option>G</option><option>PG</option><option>PG-13</option><option>R</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <NBButton variant="ghost" onClick={onClose}>Cancel</NBButton>
          <NBButton variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Show"}
          </NBButton>
        </div>
      </div>
    </div>
  );
}

export default function ShowsPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await showsApi.getAll();
      setShows(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await showsApi.delete(id);
      toast.success("Show deleted!");
      setSelected(null);
      load();
    } catch (e) {
      toast.error("Failed to delete: " + e.message);
    }
  };

  const filtered = shows.filter(s => {
    if (filter === "all") return true;
    return getShowType(s) === filter;
  });

  const movies = shows.filter(s => getShowType(s) === "movie").length;
  const docs = shows.filter(s => getShowType(s) === "documentary").length;
  const live = shows.filter(s => getShowType(s) === "live").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-nb-ink">Shows</h1>
          <p className="text-nb-ink/60 text-sm mt-1">All movies, documentaries & live screenings</p>
        </div>
        <NBButton variant="primary" size="lg" icon={Plus} onClick={() => setAdding(true)}>
          Add Show
        </NBButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill label="Total" value={shows.length} icon={Clapperboard} color="accent" />
        <StatPill label="Movies" value={movies} icon={Film} color="blue" />
        <StatPill label="Documentaries" value={docs} icon={FileText} color="purple" />
        <StatPill label="Live" value={live} icon={Radio} color="warn" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[["all","All"], ["movie","Movies"], ["documentary","Docs"], ["live","Live"]].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full border-2 border-nb-ink text-sm font-bold transition-all hover:-translate-y-0.5 ${filter === key ? "bg-nb-ink text-white" : "bg-white text-nb-ink"}`}
            style={{ boxShadow: "var(--shadow-nb-sm)" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? <LoadingSpinner /> :
       error ? <ErrorState message={error} onRetry={load} /> :
       filtered.length === 0 ? (
        <EmptyState icon={Clapperboard} title="No shows found" description="Add your first show to get started."
          action={<NBButton variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add Show</NBButton>} />
       ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(show => {
            const type = getShowType(show);
            return (
              <NBCard key={show.show_id}
                className="group cursor-pointer hover:-translate-y-1 transition-all duration-200"
                style={{ boxShadow: "var(--shadow-nb)" }}
                onClick={() => setSelected(show)}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl border-2 border-nb-ink flex items-center justify-center ${type === "movie" ? "bg-nb-accent-2" : type === "documentary" ? "bg-nb-accent" : "bg-nb-warn"}`}>
                    <TypeIcon type={type} />
                  </div>
                  <Badge color={TYPE_COLOR[type]}>{TYPE_LABEL[type]}</Badge>
                </div>
                <h3 className="font-display font-bold text-nb-ink text-lg leading-tight mb-1 line-clamp-1">{show.show_name}</h3>
                <p className="text-sm text-nb-ink/50 mb-3">
                  {new Date(show.show_date).toLocaleDateString()} · {show.show_duration} min · {show.show_language}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {show.genre && <span className="text-xs font-semibold bg-nb-bg border border-nb-ink/30 rounded-full px-2 py-0.5">{show.genre}</span>}
                  {(show.m_age_rating || show.d_age_rating || show.l_age_rating) &&
                    <span className="text-xs font-bold bg-nb-error/10 text-nb-error border border-nb-error/30 rounded-full px-2 py-0.5">
                      {show.m_age_rating || show.d_age_rating || show.l_age_rating}
                    </span>}
                </div>
                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="flex-1 py-1.5 border-2 border-nb-ink rounded-lg text-xs font-bold bg-nb-bg hover:bg-nb-accent transition-colors flex items-center justify-center gap-1"
                    onClick={e => { e.stopPropagation(); setSelected(show); }}>
                    <Eye size={12} /> View
                  </button>
                  <button
                    className="flex-1 py-1.5 border-2 border-nb-ink rounded-lg text-xs font-bold bg-nb-bg hover:bg-nb-error hover:text-white transition-colors flex items-center justify-center gap-1"
                    onClick={e => { e.stopPropagation(); handleDelete(show.show_id); }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </NBCard>
            );
          })}
        </div>
      )}

      {selected && <ShowModal show={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />}
      {adding && <AddShowModal onClose={() => setAdding(false)} onCreated={load} />}
    </div>
  );
}
