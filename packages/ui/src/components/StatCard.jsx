import { createElement } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ label, value, icon, color, colorBg, change }) {
  const isNegative = typeof change === "number" && change < 0;
  const ArrowIcon = isNegative ? ArrowDownRight : ArrowUpRight;

  return (
    <div className="soft-card hover-lift p-6 bg-[var(--surface)] border-[var(--veloce-border)]">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
          {label}
        </span>
        {icon && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
            style={{ background: colorBg }}
          >
            {createElement(icon, { size: 16, color })}
          </div>
        )}
      </div>
      <div className="text-[28px] font-bold tracking-[-0.02em] text-[var(--ink)]">
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
