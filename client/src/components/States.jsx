import { Loader2 } from "lucide-react";

export function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 size={40} className="animate-spin text-nb-ink" />
      <p className="text-nb-ink/60 font-semibold">{text}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      {Icon && (
        <div className="w-20 h-20 bg-nb-accent border-2 border-nb-ink rounded-2xl flex items-center justify-center"
          style={{ boxShadow: "var(--shadow-nb-sm)" }}>
          <Icon size={36} className="text-nb-ink" />
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold font-display text-nb-ink">{title}</h3>
        {description && <p className="text-sm text-nb-ink/60 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-20 h-20 bg-nb-error border-2 border-nb-ink rounded-2xl flex items-center justify-center"
        style={{ boxShadow: "var(--shadow-nb-sm)" }}>
        <span className="text-3xl">⚠️</span>
      </div>
      <div>
        <h3 className="text-xl font-bold font-display text-nb-ink">Error</h3>
        <p className="text-sm text-nb-ink/60 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-nb-ink text-white border-2 border-nb-ink rounded-xl font-semibold hover:-translate-y-0.5 transition-all"
          style={{ boxShadow: "var(--shadow-nb-sm)" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
