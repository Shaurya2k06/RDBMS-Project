import { cn } from "@/lib/utils";

const variantStyles = {
  primary: "bg-nb-accent text-nb-ink border-nb-ink hover:bg-nb-accent/90",
  secondary: "bg-nb-accent-2 text-nb-ink border-nb-ink hover:bg-nb-accent-2/90",
  danger: "bg-nb-error text-white border-nb-ink hover:bg-nb-error/90",
  ghost: "bg-transparent text-nb-ink border-nb-ink hover:bg-nb-ink hover:text-white",
  dark: "bg-nb-ink text-white border-nb-ink hover:bg-nb-ink/80",
  warn: "bg-nb-warn text-nb-ink border-nb-ink hover:bg-nb-warn/90",
  purple: "bg-nb-purple text-nb-ink border-nb-ink hover:bg-nb-purple/90",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm font-semibold",
  lg: "px-7 py-3.5 text-base font-bold",
};

export function NBButton({
  children,
  variant = "primary",
  size = "md",
  className,
  icon: Icon,
  disabled,
  onClick,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 border-2 rounded-xl font-semibold transition-all duration-150",
        "hover:-translate-y-0.5 active:translate-y-0",
        "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      style={{ boxShadow: disabled ? "none" : "var(--shadow-nb-sm)" }}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
