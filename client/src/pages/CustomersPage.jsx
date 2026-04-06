import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Users, Trash2, Eye, Phone, Calendar, BookOpen, Star, Pencil } from "lucide-react";
import { customersApi } from "@/lib/api";
import { NBCard } from "@/components/NBCard";
import { NBButton } from "@/components/NBButton";
import { StatPill } from "@/components/StatPill";
import { LoadingSpinner, EmptyState, ErrorState } from "@/components/States";

function CustomerDetailModal({ cust, onClose, onDelete, onEdit }) {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState("info");

  useEffect(() => {
    customersApi.getBookings(cust.cust_id).then(setBookings).catch(() => {});
    customersApi.getReviews(cust.cust_id).then(setReviews).catch(() => {});
  }, [cust.cust_id]);

  const age = cust.dob ? Math.floor((Date.now() - new Date(cust.dob)) / (1000 * 60 * 60 * 24 * 365)) : null;
  const initials = `${cust.first_name[0]}${cust.last_name[0]}`.toUpperCase();
  const colors = ["bg-nb-accent", "bg-nb-accent-2", "bg-nb-purple", "bg-nb-pink", "bg-nb-warn"];
  const color = colors[cust.cust_id % colors.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "var(--shadow-nb)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-16 h-16 ${color} border-2 border-nb-ink rounded-2xl flex items-center justify-center text-nb-ink text-2xl font-display font-black`}>
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">{cust.first_name} {cust.last_name}</h2>
            <p className="text-sm text-nb-ink/60">Customer #{cust.cust_id}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          {["info","bookings","reviews"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-full border-2 border-nb-ink text-xs font-bold capitalize transition-all ${tab === t ? "bg-nb-ink text-white" : "bg-white"}`}>
              {t}
            </button>
          ))}
        </div>
        {tab === "info" && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-nb-ink/50 font-semibold uppercase">Phone</p><p className="font-semibold">{cust.phone_no || "—"}</p></div>
            <div><p className="text-xs text-nb-ink/50 font-semibold uppercase">DOB</p><p className="font-semibold">{cust.dob ? new Date(cust.dob).toLocaleDateString() : "—"}</p></div>
            <div><p className="text-xs text-nb-ink/50 font-semibold uppercase">Age</p><p className="font-semibold">{age ? `${age} yrs` : "—"}</p></div>
          </div>
        )}
        {tab === "bookings" && (
          <div className="space-y-2">
            {bookings.length === 0 ? <p className="text-sm text-nb-ink/50 text-center py-4">No bookings yet</p> :
              bookings.map(b => (
                <div key={b.booking_id} className="flex items-center justify-between p-3 bg-nb-bg border-2 border-nb-ink/20 rounded-xl text-sm">
                  <div>
                    <p className="font-semibold">{b.show_name}</p>
                    <p className="text-xs text-nb-ink/50">{new Date(b.booking_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${b.booking_status === "Confirmed" ? "bg-nb-ok/20 text-nb-ok border-nb-ok/30" : b.booking_status === "Cancelled" ? "bg-nb-error/20 text-nb-error border-nb-error/30" : "bg-nb-warn/20 text-nb-warn border-nb-warn/30"}`}>
                    {b.booking_status}
                  </span>
                </div>
              ))}
          </div>
        )}
        {tab === "reviews" && (
          <div className="space-y-2">
            {reviews.length === 0 ? <p className="text-sm text-nb-ink/50 text-center py-4">No reviews yet</p> :
              reviews.map(r => (
                <div key={r.review_id} className="flex items-center justify-between p-3 bg-nb-bg border-2 border-nb-ink/20 rounded-xl">
                  <span className="text-sm font-semibold">Review #{r.review_id}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star key={i} size={14} fill={i < r.rating ? "#F59E0B" : "none"} className={i < r.rating ? "text-nb-warn" : "text-nb-ink/20"} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
        <div className="flex gap-3 justify-end mt-5">
          <NBButton variant="ghost" icon={Pencil} onClick={() => onEdit(cust)}>Edit</NBButton>
          <NBButton variant="ghost" onClick={onClose}>Close</NBButton>
          <NBButton variant="danger" icon={Trash2} onClick={() => onDelete(cust.cust_id)}>Delete</NBButton>
        </div>
      </div>
    </div>
  );
}

function CustomerFormModal({ title, submitLabel, initialCustomer, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone_no: "", dob: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "w-full border-2 border-nb-ink rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-nb-accent/50";
  const labelCls = "block text-xs font-bold uppercase tracking-wide text-nb-ink/60 mb-1";

  useEffect(() => {
    setForm({
      first_name: initialCustomer?.first_name || "",
      last_name: initialCustomer?.last_name || "",
      phone_no: initialCustomer?.phone_no || "",
      dob: initialCustomer?.dob ? new Date(initialCustomer.dob).toISOString().slice(0, 10) : "",
    });
  }, [initialCustomer]);

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (e) { toast.error("Failed: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white border-2 border-nb-ink rounded-2xl p-6 max-w-sm w-full"
        style={{ boxShadow: "var(--shadow-nb)" }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-display font-bold mb-5">{title}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>First Name</label><input className={inputCls} value={form.first_name} onChange={e => set("first_name", e.target.value)} /></div>
            <div><label className={labelCls}>Last Name</label><input className={inputCls} value={form.last_name} onChange={e => set("last_name", e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>Phone</label><input className={inputCls} value={form.phone_no} onChange={e => set("phone_no", e.target.value)} placeholder="+91..." /></div>
          <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={form.dob} onChange={e => set("dob", e.target.value)} /></div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <NBButton variant="ghost" onClick={onClose}>Cancel</NBButton>
          <NBButton variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : submitLabel}</NBButton>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true); setError(null);
    try { setCustomers(await customersApi.getAll()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try { await customersApi.delete(id); toast.success("Customer deleted!"); setSelected(null); load(); }
    catch (e) { toast.error("Failed: " + e.message); }
  };

  const handleCreate = async (data) => {
    await customersApi.create(data);
    toast.success("Customer added!");
    load();
  };

  const handleUpdate = async (id, data) => {
    await customersApi.update(id, data);
    toast.success("Customer updated!");
    setSelected(current => (current?.cust_id === id ? { ...current, ...data } : current));
    load();
  };

  const filtered = customers.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone_no || "").includes(search)
  );

  const colors = ["bg-nb-accent", "bg-nb-accent-2", "bg-nb-purple", "bg-nb-pink", "bg-nb-warn"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-nb-ink">Customers</h1>
          <p className="text-nb-ink/60 text-sm mt-1">Manage customer profiles</p>
        </div>
        <NBButton variant="primary" size="lg" icon={Plus} onClick={() => setAdding(true)}>Add Customer</NBButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatPill label="Total" value={customers.length} icon={Users} color="accent" />
        <StatPill label="This Month" value={customers.length} icon={Calendar} color="blue" />
        <StatPill label="Active" value={customers.length} icon={BookOpen} color="purple" />
      </div>

      <div className="relative">
        <input
          className="w-full border-2 border-nb-ink rounded-xl pl-4 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-nb-accent/50"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? <LoadingSpinner /> :
       error ? <ErrorState message={error} onRetry={load} /> :
       filtered.length === 0 ? <EmptyState icon={Users} title="No customers found" action={<NBButton variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add Customer</NBButton>} /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(cust => {
            const initials = `${cust.first_name[0]}${cust.last_name[0]}`.toUpperCase();
            const color = colors[cust.cust_id % colors.length];
            return (
              <NBCard key={cust.cust_id}
                className="group cursor-pointer hover:-translate-y-1 transition-all duration-200"
                style={{ boxShadow: "var(--shadow-nb)" }}
                onClick={() => setSelected(cust)}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${color} border-2 border-nb-ink rounded-xl flex items-center justify-center text-nb-ink text-lg font-display font-black shrink-0`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-nb-ink truncate">{cust.first_name} {cust.last_name}</h3>
                    <p className="text-xs text-nb-ink/50 font-mono">#{cust.cust_id}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  {cust.phone_no && (
                    <div className="flex items-center gap-2 text-nb-ink/60">
                      <Phone size={13} /><span>{cust.phone_no}</span>
                    </div>
                  )}
                  {cust.dob && (
                    <div className="flex items-center gap-2 text-nb-ink/60">
                      <Calendar size={13} /><span>{new Date(cust.dob).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 py-1.5 border-2 border-nb-ink rounded-lg text-xs font-bold bg-nb-bg hover:bg-nb-accent transition-colors flex items-center justify-center gap-1"
                    onClick={e => { e.stopPropagation(); setSelected(cust); }}>
                    <Eye size={12} /> View
                  </button>
                  <button className="flex-1 py-1.5 border-2 border-nb-ink rounded-lg text-xs font-bold bg-nb-bg hover:bg-nb-warn hover:text-white transition-colors flex items-center justify-center gap-1"
                    onClick={e => { e.stopPropagation(); setEditing(cust); }}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button className="flex-1 py-1.5 border-2 border-nb-ink rounded-lg text-xs font-bold bg-nb-bg hover:bg-nb-error hover:text-white transition-colors flex items-center justify-center gap-1"
                    onClick={e => { e.stopPropagation(); handleDelete(cust.cust_id); }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </NBCard>
            );
          })}
        </div>
      )}
      {selected && <CustomerDetailModal cust={selected} onClose={() => setSelected(null)} onDelete={handleDelete} onEdit={(cust) => { setSelected(null); setEditing(cust); }} />}
      {adding && (
        <CustomerFormModal
          title="Add Customer"
          submitLabel="Add Customer"
          initialCustomer={null}
          onClose={() => setAdding(false)}
          onSubmit={handleCreate}
        />
      )}
      {editing && (
        <CustomerFormModal
          title={`Edit Customer #${editing.cust_id}`}
          submitLabel="Save Changes"
          initialCustomer={editing}
          onClose={() => setEditing(null)}
          onSubmit={(data) => handleUpdate(editing.cust_id, data)}
        />
      )}
    </div>
  );
}
