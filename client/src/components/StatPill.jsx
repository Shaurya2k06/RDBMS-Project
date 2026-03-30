import { cn } from "@/lib/utils";

export function StatPill({ label, value, icon: Icon, color = "accent" }) {
  const colorMap = {
    accent: "bg-nb-accent",
    blue: "bg-nb-accent-2",
    warn: "bg-nb-warn",
    error: "bg-nb-error",
    purple: "bg-nb-purple",
    pink: "bg-nb-pink",
  };
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-2 border-nb-ink rounded-xl px-4 py-3",
        colorMap[color]
      )}
      style={{ boxShadow: "var(--shadow-nb-sm)" }}
    >
      {Icon && (
        <div className="w-9 h-9 bg-white border-2 border-nb-ink rounded-lg flex items-center justify-center shrink-0">
          <Icon size={18} className="text-nb-ink" />
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-nb-ink/70 uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className="text-xl font-bold text-nb-ink font-display leading-none">{value}</p>
      </div>
    </div>
  );
}
