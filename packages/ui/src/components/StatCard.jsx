import { createElement } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ label, value, icon, change }) {
  const isNegative = typeof change === "number" && change < 0;
  const ArrowIcon = isNegative ? ArrowDownRight : ArrowUpRight;

  return (
    <div className="soft-card hover-lift p-6 bg-[var(--surface)] border-[var(--veloce-border)]">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
          {label}
        </span>
        {icon && createElement(icon, { size: 15, strokeWidth: 1.75, className: "text-[var(--ink-muted)]" })}
      </div>
      <div className="font-display text-[30px] font-light tracking-[-0.01em] text-[var(--ink)]">
        {value}
      </div>
      {typeof change === "number" && Number.isFinite(change) && (
        <div className="mt-3 flex items-center gap-1.5">
          <ArrowIcon
            size={14}
            className={isNegative ? "text-[var(--danger)]" : "text-[var(--success)]"}
          />
          <span
            className={`text-xs font-semibold ${
              isNegative ? "text-[var(--danger)]" : "text-[var(--success)]"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          <span className="text-xs text-[var(--ink-muted)]">vs last month</span>
        </div>
      )}
    </div>
  );
}
