import { cn } from "@/lib/utils";

const colors = {
  green: "bg-nb-accent text-nb-ink",
  blue: "bg-nb-accent-2 text-nb-ink",
  yellow: "bg-nb-warn text-nb-ink",
  red: "bg-nb-error text-white",
  purple: "bg-nb-purple text-nb-ink",
  pink: "bg-nb-pink text-nb-ink",
  gray: "bg-gray-200 text-nb-ink",
};

export function Badge({ children, color = "gray", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border-2 border-nb-ink",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
