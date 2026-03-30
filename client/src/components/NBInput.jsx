import { cn } from "@/lib/utils";

export function NBInput({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-nb-ink">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full border-2 border-nb-ink rounded-xl px-4 py-2.5 text-sm font-body bg-white",
          "focus:outline-none focus:ring-4 focus:ring-nb-accent/50",
          "placeholder:text-gray-400",
          error && "border-nb-error ring-2 ring-nb-error/30",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-nb-error font-semibold">{error}</p>}
    </div>
  );
}

export function NBSelect({ label, error, className, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-nb-ink">{label}</label>
      )}
      <select
        className={cn(
          "w-full border-2 border-nb-ink rounded-xl px-4 py-2.5 text-sm font-body bg-white",
          "focus:outline-none focus:ring-4 focus:ring-nb-accent/50",
          error && "border-nb-error",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-nb-error font-semibold">{error}</p>}
    </div>
  );
}

export function NBTextarea({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-nb-ink">{label}</label>
      )}
      <textarea
        rows={4}
        className={cn(
          "w-full border-2 border-nb-ink rounded-xl px-4 py-2.5 text-sm font-body bg-white resize-none",
          "focus:outline-none focus:ring-4 focus:ring-nb-accent/50",
          "placeholder:text-gray-400",
          error && "border-nb-error",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-nb-error font-semibold">{error}</p>}
    </div>
  );
}
