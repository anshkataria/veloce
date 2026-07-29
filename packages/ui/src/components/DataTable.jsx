export default function DataTable({ columns, children, emptyColSpan }) {
  return (
    <div className="soft-card overflow-hidden bg-[var(--surface)] border-[var(--veloce-border)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--veloce-line)] bg-[var(--stone)]/20">
              {columns.map((h) => (
                <th
                  key={h}
                  className="px-8 py-4 text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.Empty = function DataTableEmpty({ colSpan, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-8 py-12 text-center text-sm text-[var(--ink-muted)]">
        {children}
      </td>
    </tr>
  );
};

DataTable.Row = function DataTableRow({ isLast, className = "", ...props }) {
  return (
    <tr
      className={`transition-colors hover:bg-[var(--stone)]/30 ${
        isLast ? "" : "border-b border-[var(--veloce-line)]"
      } ${className}`}
      {...props}
    />
  );
};
