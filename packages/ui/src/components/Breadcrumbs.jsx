import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-[var(--ink-muted)] uppercase">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-[var(--veloce-border)]" />}
            {item.to && !isLast ? (
              <Link to={item.to} className="transition-colors hover:text-[var(--ink)]">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-[var(--ink)]" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
