import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Star, TrendingUp, Award, Trash2 } from "lucide-react";
import { reviewsApi, customersApi } from "@/lib/api";
import { NBButton } from "@/components/NBButton";
import { NBCard } from "@/components/NBCard";
import { StatPill } from "@/components/StatPill";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/States";

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < rating ? "#F59E0B" : "none"}
          className={i < rating ? "text-nb-warn" : "text-nb-ink/20"}
        />
      ))}
    </div>
  );
}

function AddReviewModal({ onClose, onCreated }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ cust_id: "", rating: 5 });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "w-full border-2 border-nb-ink rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-nb-accent/50";
  const labelCls = "block text-xs font-bold uppercase tracking-wide text-nb-ink/60 mb-1";

  useEffect(() => { customersApi.getAll().then(setCustomers).catch(() => {}); }, []);

  const handleSubmit = async () => {
    if (!form.cust_id) { toast.error("Select a customer"); return; }
    setLoading(true);
    try {
      await reviewsApi.create({ cust_id: parseInt(form.cust_id), rating: parseInt(form.rating) });
      toast.success("Review submitted!"); onCreated(); onClose();
    } catch (e) { toast.error("Failed: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-sm w-full"
        style={{ boxShadow: "var(--shadow-nb)" }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-display font-bold mb-5">Add Review</h2>
        <div className="space-y-4">
          <div><label className={labelCls}>Customer</label>
            <select className={inputCls} value={form.cust_id} onChange={e => set("cust_id", e.target.value)}>
              <option value="">-- Select Customer --</option>
              {customers.map(c => <option key={c.cust_id} value={c.cust_id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Rating</label>
            <div className="flex items-center gap-3">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                  onClick={() => set("rating", n)}
                  className={`w-10 h-10 rounded-xl border-2 font-bold text-sm transition-all ${form.rating >= n ? "bg-nb-warn border-nb-ink text-nb-ink" : "bg-white border-nb-ink/30 text-nb-ink/30 hover:border-nb-ink"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <NBButton variant="ghost" onClick={onClose}>Cancel</NBButton>
          <NBButton variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Submit"}</NBButton>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [r, s] = await Promise.all([reviewsApi.getAll(), reviewsApi.getStats()]);
      setReviews(r); setStats(s);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try { await reviewsApi.delete(id); toast.success("Review deleted!"); load(); }
    catch (e) { toast.error("Failed: " + e.message); }
  };

  const dist = [5,4,3,2,1].map(r => ({
    rating: r,
    count: reviews.filter(rv => rv.rating === r).length,
    pct: reviews.length ? Math.round(reviews.filter(rv => rv.rating === r).length / reviews.length * 100) : 0,
  }));

  const colors = ["bg-nb-accent", "bg-nb-accent-2", "bg-nb-purple", "bg-nb-pink", "bg-nb-warn"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-nb-ink">Reviews</h1>
          <p className="text-nb-ink/60 text-sm mt-1">Customer ratings and satisfaction</p>
        </div>
        <NBButton variant="primary" size="lg" icon={Plus} onClick={() => setAdding(true)}>Add Review</NBButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatPill label="Total Reviews" value={reviews.length} icon={Star} color="warn" />
        <StatPill label="Avg Rating" value={stats?.avg_rating || "—"} icon={TrendingUp} color="blue" />
        <StatPill label="5-Star Reviews" value={reviews.filter(r => r.rating === 5).length} icon={Award} color="accent" />
      </div>

      {loading ? <LoadingSpinner /> :
       error ? <ErrorState message={error} onRetry={load} /> : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Distribution */}
          <NBCard className="lg:col-span-1" style={{ boxShadow: "var(--shadow-nb)" }}>
            <h2 className="font-display font-bold text-lg mb-4">Rating Distribution</h2>
            {stats?.avg_rating && (
              <div className="text-center mb-6">
                <div className="text-6xl font-display font-black text-nb-ink">{stats.avg_rating}</div>
                <StarRating rating={Math.round(parseFloat(stats.avg_rating))} />
                <p className="text-xs text-nb-ink/50 mt-1">{stats.total_reviews} reviews</p>
              </div>
            )}
            <div className="space-y-2">
              {dist.map(({ rating, count, pct }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs font-bold w-4 text-right">{rating}</span>
                  <Star size={12} fill="#F59E0B" className="text-nb-warn shrink-0" />
                  <div className="flex-1 bg-nb-bg border border-nb-ink/20 rounded-full h-2.5">
                    <div className="bg-nb-warn rounded-full h-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-nb-ink/50 w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
          </NBCard>

          {/* Reviews list */}
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <EmptyState icon={Star} title="No reviews yet" action={<NBButton variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add Review</NBButton>} />
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map(review => {
                  const color = colors[review.review_id % colors.length];
                  const initials = review.first_name ? `${review.first_name[0]}${review.last_name[0]}`.toUpperCase() : "?";
                  return (
                    <NBCard key={review.review_id}
                      className="hover:-translate-y-1 transition-all duration-200"
                      style={{ boxShadow: "var(--shadow-nb)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-9 h-9 ${color} border-2 border-nb-ink rounded-xl flex items-center justify-center text-sm font-display font-black text-nb-ink`}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-nb-ink">{review.first_name} {review.last_name}</p>
                            <p className="text-xs text-nb-ink/40 font-mono">Review #{review.review_id}</p>
                          </div>
                        </div>
                        <button
                          className="p-1.5 rounded-lg border border-nb-ink/20 hover:bg-nb-error hover:text-white hover:border-nb-error transition-all"
                          onClick={() => handleDelete(review.review_id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <StarRating rating={review.rating} />
                      <div className={`mt-3 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 ${color} border border-nb-ink/30 rounded-full`}>
                        {review.rating}/5 stars
                      </div>
                    </NBCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      {adding && <AddReviewModal onClose={() => setAdding(false)} onCreated={load} />}
    </div>
  );
}
