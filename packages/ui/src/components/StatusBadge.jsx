export default function StatusBadge({ meta, label, onClick, className = "" }) {
  if (!meta) return null;

  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      onClick={onClick}
      className={`inline-flex items-center gap-2 whitespace-nowrap text-[11px] font-semibold tracking-widest uppercase ${
        onClick ? "transition-opacity hover:opacity-70" : ""
      } ${className}`}
      style={{ color: meta.color }}
    >
      <span
        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ background: meta.color }}
        aria-hidden="true"
      />
      {label ?? meta.label}
    </Tag>
  );
}
