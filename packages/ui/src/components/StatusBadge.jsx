export default function StatusBadge({ meta, label, onClick, className = "" }) {
  if (!meta) return null;

  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      onClick={onClick}
      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase ${
        onClick ? "transition-opacity hover:opacity-80" : ""
      } ${className}`}
      style={{ color: meta.color, background: meta.bg }}
    >
      {label ?? meta.label}
    </Tag>
  );
}
