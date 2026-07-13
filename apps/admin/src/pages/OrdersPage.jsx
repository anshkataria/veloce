import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";

const STATUSES = [
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS = {
  DELIVERED: { color: "var(--success)", bg: "var(--success-bg)" },
  CONFIRMED: { color: "var(--info)", bg: "var(--info-bg)" },
  SHIPPED: { color: "var(--info)", bg: "var(--info-bg)" },
  PROCESSING: { color: "var(--warning)", bg: "var(--warning-bg)" },
  CANCELLED: { color: "var(--danger)", bg: "var(--danger-bg)" },
};

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [editingId, setEditing] = useState(null);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => orderService.getAll().then((r) => r.data),
    refetchInterval: 30000, // auto refresh every 30s
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
      setEditing(null);
    },
  });

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const formatPrice = (v) => {
    const n = Number(v ?? 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[var(--ink-muted)] uppercase">
            Concierge Operations
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-wide text-[var(--ink)]">
            Orders
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            {filtered.length} total orders to fulfill.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 bg-[var(--surface)] p-1.5 rounded-full border border-[var(--veloce-border)] shadow-sm">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-5 py-2 text-[11px] font-semibold tracking-widest uppercase transition-all duration-[240ms] ease-[var(--ease-premium)] ${
                filter === s
                  ? "bg-[var(--oxblood)] text-[var(--surface)] shadow-md"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-sm text-[var(--ink-muted)]">
          Loading orders...
        </div>
      )}

      {isError && (
        <div className="py-12 text-center text-sm text-[var(--danger)]">
          Failed to load orders. Is the backend running?
        </div>
      )}

      {!isLoading && !isError && (
        <div className="soft-card overflow-hidden bg-[var(--surface)] border-[var(--veloce-border)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--veloce-line)] bg-[var(--stone)]/20">
                  {[
                    "Order",
                    "Customer",
                    "Items",
                    "Total",
                    "Date",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-4 text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-12 text-center text-sm text-[var(--ink-muted)]"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filtered.map((order, i) => (
                    <tr
                      key={order.id}
                      className={`transition-colors hover:bg-[var(--stone)]/30 ${
                        i < filtered.length - 1
                          ? "border-b border-[var(--veloce-line)]"
                          : ""
                      }`}
                    >
                      <td className="px-8 py-5 text-sm font-semibold tracking-wide text-[var(--ink)]">
                        ORD-{order.id}
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-semibold tracking-wide text-[var(--ink)]">
                          {order.shippingName}
                        </div>
                        <div className="mt-1 text-[11px] font-medium tracking-wide text-[var(--ink-muted)]">
                          {order.shippingEmail}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-[var(--ink-muted)]">
                        {order.items?.length ?? 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold tracking-wide text-[var(--ink)]">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-8 py-5 text-sm font-medium tracking-wide text-[var(--ink-muted)]">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-8 py-5">
                        {editingId === order.id ? (
                          <select
                            defaultValue={order.status}
                            onChange={(e) =>
                              statusMutation.mutate({
                                id: order.id,
                                status: e.target.value,
                              })
                            }
                            onBlur={() => setEditing(null)}
                            autoFocus
                            className="rounded-xl border border-[var(--veloce-border)] bg-[var(--stone)]/20 px-3 py-2 text-xs font-semibold tracking-wide text-[var(--ink)] outline-none transition-colors focus:border-[var(--oxblood)]"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditing(order.id)}
                            title="Click to update status"
                            className="inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
                            style={{
                              color: STATUS[order.status]?.color,
                              background: STATUS[order.status]?.bg,
                            }}
                          >
                            {order.status}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
