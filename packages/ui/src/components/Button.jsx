const VARIANTS = {
  primary:
    "bg-[var(--oxblood)] text-[var(--surface)] hover:bg-[var(--veloce-oxblood-deep)] active:scale-[0.985]",
  secondary:
    "border border-[var(--veloce-border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-[var(--stone)] hover:text-[var(--ink)]",
  ghost: "text-[var(--ink-muted)] hover:bg-[var(--stone)]/50 hover:text-[var(--ink)]",
  danger: "bg-[var(--danger)] text-white hover:bg-[var(--danger)]/80",
};

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] font-semibold tracking-wide transition-all duration-200 ease-[var(--ease-premium)] disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </Component>
  );
}
