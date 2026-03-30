import { cn } from "@/lib/utils";

export function NBCard({ children, className, as: Tag = "div", ...props }) {
  return (
    <Tag
      className={cn(
        "bg-white border-2 border-nb-ink shadow-nb-sm rounded-nb p-5",
        className
      )}
      style={{ boxShadow: "var(--shadow-nb-sm)", borderRadius: "var(--radius-nb)" }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function NBCardLarge({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white border-2 border-nb-ink rounded-nb p-6",
        className
      )}
      style={{ boxShadow: "var(--shadow-nb)", borderRadius: "var(--radius-nb)" }}
      {...props}
    >
      {children}
    </div>
  );
}
