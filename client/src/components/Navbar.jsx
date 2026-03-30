import { NavLink, useLocation } from "react-router-dom";
import { Film, Clapperboard, Monitor, Users, CalendarCheck, Star, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/shows", label: "Shows", icon: Clapperboard },
  { to: "/screens", label: "Screens", icon: Monitor },
  { to: "/seats", label: "Seats", icon: Film },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/reviews", label: "Reviews", icon: Star },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 bg-nb-ink border-b-2 border-nb-ink"
      style={{ boxShadow: "0 4px 0 0 rgba(0,0,0,0.9)" }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group" aria-label="CineDB Home">
          <div
            className="w-9 h-9 bg-nb-accent border-2 border-white rounded-xl flex items-center justify-center transition-transform group-hover:-rotate-6"
          >
            <Film size={18} className="text-nb-ink" />
          </div>
          <span className="text-white font-display font-bold text-xl tracking-tight">
            Cine<span className="text-nb-accent">DB</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                  isActive
                    ? "bg-nb-accent text-nb-ink"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t-2 border-white/20 bg-nb-ink/95 px-4 pb-4 pt-2 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
                  isActive
                    ? "bg-nb-accent text-nb-ink"
                    : "text-white/80 hover:bg-white/10"
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
