export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[var(--ink-muted)] uppercase">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-4xl font-light tracking-wide text-[var(--ink)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
