import { useNavigate } from "react-router-dom";
import { Film, Monitor, Armchair, Users, CalendarCheck, Star, TrendingUp, Clapperboard, ArrowRight } from "lucide-react";
import { NBCard } from "@/components/NBCard";
import { NBButton } from "@/components/NBButton";

const sections = [
  {
    icon: Clapperboard,
    label: "Shows",
    description: "Manage movies, documentaries and live screenings playing at your cinema.",
    to: "/shows",
    color: "bg-nb-accent",
    badge: "Movies · Docs · Live",
  },
  {
    icon: Monitor,
    label: "Screens",
    description: "View and configure all screening rooms — IMAX, 4D, 3D, and standard 2D.",
    to: "/screens",
    color: "bg-nb-accent-2",
    badge: "IMAX · 4D · 3D · 2D",
  },
  {
    icon: Armchair,
    label: "Seats",
    description: "Browse seat inventory across Regular, Premium, and Recliner categories.",
    to: "/seats",
    color: "bg-nb-purple",
    badge: "Regular · Premium · Recliner",
  },
  {
    icon: Users,
    label: "Customers",
    description: "Manage customer profiles and view their booking and review history.",
    to: "/customers",
    color: "bg-nb-pink",
    badge: "Profiles · History",
  },
  {
    icon: CalendarCheck,
    label: "Bookings",
    description: "Track all ticket bookings — confirmed, pending, or cancelled.",
    to: "/bookings",
    color: "bg-nb-warn",
    badge: "Confirmed · Pending · Cancelled",
  },
  {
    icon: Star,
    label: "Reviews",
    description: "Read customer ratings and analyse the average audience satisfaction score.",
    to: "/reviews",
    color: "bg-nb-ok",
    badge: "Ratings · Stats",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-nb-ink bg-nb-ink text-white p-8 md:p-14"
        style={{ boxShadow: "var(--shadow-nb)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 bg-nb-accent text-nb-ink border-2 border-nb-ink rounded-full px-4 py-1.5 text-sm font-bold"
              style={{ boxShadow: "var(--shadow-nb-sm)" }}>
              <Film size={14} />
              Cinema Booking Management System
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black leading-tight">
              Manage Your<br />
              <span className="text-nb-accent">Cinema</span>{" "}
              <span className="text-nb-accent-2">Like a Pro</span>
            </h1>
            <p className="text-white/70 text-lg max-w-lg">
              A complete RDBMS-backed system for screens, shows, seats, customers, bookings, and reviews — all in one dashboard.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <NBButton variant="primary" size="lg" icon={Clapperboard} onClick={() => navigate("/shows")}>
                Browse Shows
              </NBButton>
              <NBButton variant="ghost" size="lg" icon={CalendarCheck}
                onClick={() => navigate("/bookings")}
                className="border-white text-white hover:bg-white hover:text-nb-ink">
                Manage Bookings
              </NBButton>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3 shrink-0">
            {[
              { icon: Film, label: "6 Shows", color: "bg-nb-accent" },
              { icon: Monitor, label: "5 Screens", color: "bg-nb-accent-2" },
              { icon: Users, label: "5 Customers", color: "bg-nb-purple" },
              { icon: CalendarCheck, label: "6 Bookings", color: "bg-nb-warn" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label}
                className={`flex items-center gap-3 ${color} border-2 border-white rounded-xl px-4 py-3`}
                style={{ boxShadow: "4px 4px 0 0 rgba(255,255,255,0.3)" }}>
                <Icon size={16} className="text-nb-ink" />
                <span className="text-nb-ink font-bold text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-nb-ink">Management Modules</h2>
          <div className="flex items-center gap-2 text-sm text-nb-ink/50 font-semibold">
            <TrendingUp size={14} />
            6 modules
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map(({ icon: Icon, label, description, to, color, badge }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="text-left group w-full"
            >
              <NBCard className="h-full transition-all duration-200 hover:-translate-y-1 cursor-pointer group-hover:shadow-none"
                style={{ boxShadow: "var(--shadow-nb)" }}>
                <div className={`w-12 h-12 ${color} border-2 border-nb-ink rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6`}>
                  <Icon size={22} className="text-nb-ink" />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-display font-bold text-nb-ink">{label}</h3>
                  <ArrowRight size={16} className="text-nb-ink/40 mt-1 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-sm text-nb-ink/60 mb-4">{description}</p>
                <span className="text-xs font-bold text-nb-ink bg-nb-bg border-2 border-nb-ink rounded-full px-3 py-1">
                  {badge}
                </span>
              </NBCard>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
