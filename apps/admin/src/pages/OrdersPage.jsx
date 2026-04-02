import { useState } from "react";

const initialOrders = [
  {
    id: "ORD-128",
    customer: "Priya Sharma",
    email: "priya@example.com",
    product: "Ivory Chanderi Suit",
    amount: 3499,
    status: "Delivered",
    date: "2025-01-20",
  },
  {
    id: "ORD-127",
    customer: "Ananya Mehta",
    email: "ananya@example.com",
    product: "Rose Silk Kurta Set",
    amount: 5299,
    status: "Shipped",
    date: "2025-01-19",
  },
  {
    id: "ORD-126",
    customer: "Sneha Patel",
    email: "sneha@example.com",
    product: "Sage Green Anarkali",
    amount: 4799,
    status: "Processing",
    date: "2025-01-18",
  },
  {
    id: "ORD-125",
    customer: "Divya Nair",
    email: "divya@example.com",
    product: "Terracotta Cotton Set",
    amount: 2999,
    status: "Delivered",
    date: "2025-01-17",
  },
  {
    id: "ORD-124",
    customer: "Riya Verma",
    email: "riya@example.com",
    product: "Blush Pink Dupatta",
    amount: 1299,
    status: "Cancelled",
    date: "2025-01-16",
  },
  {
    id: "ORD-123",
    customer: "Meera Joshi",
    email: "meera@example.com",
    product: "Midnight Blue Sharara",
    amount: 6299,
    status: "Processing",
    date: "2025-01-15",
  },
];

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS = {
  Delivered: { color: "var(--success)", bg: "var(--success-bg)" },
  Shipped: { color: "var(--info)", bg: "var(--info-bg)" },
  Processing: { color: "var(--warning)", bg: "var(--warning-bg)" },
  Cancelled: { color: "var(--danger)", bg: "var(--danger-bg)" },
};

const card = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  overflow: "hidden",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (id, status) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    setEditingId(null);
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

        {/* Filter pills */}
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
                transition: "all 0.15s",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  "Order ID",
                  "Customer",
                  "Product",
                  "Amount",
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
              {filtered.map((o, i) => (
                <tr
                  key={o.id}
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
                    {o.id}
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {o.customer}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        marginTop: "1px",
                      }}
                    >
                      {o.email}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {o.product}
                  </td>
                  <td
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    ₹{o.amount.toLocaleString("en-IN")}
                  </td>
                  <td
                    style={{
                      padding: "13px 20px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {new Date(o.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "13px 20px" }}>
                    {editingId === o.id ? (
                      <select
                        defaultValue={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
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
                        onClick={() => setEditingId(o.id)}
                        title="Click to update"
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          border: "none",
                          cursor: "pointer",
                          color: STATUS[o.status].color,
                          background: STATUS[o.status].bg,
                        }}
                      >
                        {o.status}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
