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

const card = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  overflow: "hidden",
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
    const n = Number(v);
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Orders
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginTop: "2px",
            }}
          >
            {filtered.length} orders
          </p>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "5px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--font-main)",
                textTransform: "capitalize",
                border: filter === s ? "none" : "1px solid var(--border)",
                background: filter === s ? "var(--accent)" : "transparent",
                color:
                  filter === s ? "var(--accent-fg)" : "var(--text-secondary)",
              }}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--text-muted)",
            fontSize: "13px",
          }}
        >
          Loading orders...
        </div>
      )}

      {isError && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--danger)",
            fontSize: "13px",
          }}
        >
          Failed to load orders. Is the backend running?
        </div>
      )}

      {!isLoading && !isError && (
        <div style={card}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
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
                      style={{
                        textAlign: "left",
                        padding: "10px 20px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
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
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                      }}
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filtered.map((order, i) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom:
                          i < filtered.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                      }}
                    >
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        ORD-{order.id}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--text-primary)",
                          }}
                        >
                          {order.shippingName}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            marginTop: "1px",
                          }}
                        >
                          {order.shippingEmail}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {order.items?.length ?? 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
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
                            style={{
                              fontSize: "12px",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--border)",
                              background: "var(--bg-input)",
                              color: "var(--text-primary)",
                              fontFamily: "var(--font-main)",
                              outline: "none",
                            }}
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
                            style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              padding: "3px 10px",
                              borderRadius: "20px",
                              border: "none",
                              cursor: "pointer",
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
