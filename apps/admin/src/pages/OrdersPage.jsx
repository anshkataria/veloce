import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { formatPrice, StatusBadge, DataTable, PageHeader, ORDER_STATUS_META } from "@veloce/ui";

const STATUSES = [
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [editingId, setEditing] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("veloce_admin_token");
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
    const connect = async () => {
      try {
        const response = await fetch(`${baseUrl}/orders/events`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
          signal: controller.signal,
        });
        if (!response.ok || !response.body) return;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (!controller.signal.aborted) {
          const { value, done } = await reader.read();
          if (done) break;
          if (decoder.decode(value).includes("event:order-updated")) {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") console.warn("Order event stream disconnected");
      }
    };
    connect();
    return () => controller.abort();
  }, [queryClient]);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => orderService.getAll().then((r) => r.data),
    refetchInterval: 60000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setEditing(null);
    },
  });

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          eyebrow="Concierge Operations"
          title="Orders"
          subtitle={`${filtered.length} total orders to fulfill.`}
        />

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
        <DataTable columns={["Order", "Customer", "Items", "Total", "Date", "Status"]}>
          {filtered.length === 0 ? (
            <DataTable.Empty colSpan={6}>No orders found</DataTable.Empty>
          ) : (
            filtered.map((order, i) => (
              <DataTable.Row key={order.id} isLast={i === filtered.length - 1}>
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
                    <StatusBadge
                      meta={ORDER_STATUS_META[order.status]}
                      onClick={() => setEditing(order.id)}
                    />
                  )}
                </td>
              </DataTable.Row>
            ))
          )}
        </DataTable>
      )}
    </div>
  );
}
