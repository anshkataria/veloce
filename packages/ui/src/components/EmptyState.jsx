import { createElement } from "react";

export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="py-24 text-center">
      {icon && createElement(icon, { size: 48, className: "mx-auto text-[var(--veloce-border)] mb-4" })}
      <h2 className="mb-2 font-display text-xl font-light text-[var(--ink)]">{title}</h2>
      {subtitle && <p className="mb-8 text-sm text-[var(--ink-muted)]">{subtitle}</p>}
      {action}
    </div>
  );
}
