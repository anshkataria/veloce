import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    label: "Revenue",
    value: "₹12.4 Cr",
    change: "+18%",
    icon: TrendingUp,
    color: "#1a6b3c",
    colorBg: "#edf7f1",
  },
  {
    label: "Orders",
    value: "128",
    change: "+12%",
    icon: ShoppingBag,
    color: "#1a4b8a",
    colorBg: "#eef4fd",
  },
  {
    label: "Products",
    value: "54",
    change: "+3",
    icon: Package,
    color: "#6b3fa0",
    colorBg: "#f5f0fd",
  },
  {
    label: "Customers",
    value: "340",
    change: "+8%",
    icon: Users,
    color: "#8a5a00",
    colorBg: "#fef8ec",
  },
];

const revenueData = [
  { month: "Aug", revenue: 18000 },
  { month: "Sep", revenue: 24000 },
  { month: "Oct", revenue: 19000 },
  { month: "Nov", revenue: 32000 },
  { month: "Dec", revenue: 45000 },
  { month: "Jan", revenue: 38000 },
];

const recentOrders = [
  {
    id: "ORD-128",
    customer: "Arjun Mehta",
    product: "Lamborghini Hurac\u00e1n EVO",
    amount: 32500000,
    status: "Delivered",
  },
  {
    id: "ORD-127",
    customer: "Rahul Singhania",
    product: "Porsche 911 GT3 RS",
    amount: 23500000,
    status: "Shipped",
  },
  {
    id: "ORD-126",
    customer: "Vikram Oberoi",
    product: "Mercedes-AMG GT Black Series",
    amount: 28900000,
    status: "Processing",
  },
  {
    id: "ORD-125",
    customer: "Rohan Kapoor",
    product: "BMW M4 Competition",
    amount: 9800000,
    status: "Delivered",
  },
  {
    id: "ORD-124",
    customer: "Kabir Malhotra",
    product: "McLaren 720S",
    amount: 29500000,
    status: "Cancelled",
  },
];

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
  padding: "20px",
};

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page title */}
      <div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            marginTop: "2px",
          }}
        >
          Here's what's happening in your store today.
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
        }}
      >
        {stats.map(({ label, value, change, icon: Icon, color, colorBg }) => (
          <div key={label} style={card}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {label}
              </span>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: colorBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={15} color={color} />
              </div>
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "6px",
              }}
            >
              <ArrowUpRight size={12} color="var(--success)" />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--success)",
                  fontWeight: 500,
                }}
              >
                {change}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ ...card, padding: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Revenue
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Last 6 months
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--text-primary)"
                  stopOpacity={0.12}
                />
                <stop
                  offset="95%"
                  stopColor="var(--text-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--text-primary)"
              strokeWidth={1.5}
              fill="url(#grad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Recent Orders
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {recentOrders.length} orders
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Order", "Customer", "Product", "Amount", "Status"].map(
                  (h) => (
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
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr
                  key={o.id}
                  style={{
                    borderBottom:
                      i < recentOrders.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {o.id}
                  </td>
                  <td
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {o.customer}
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
                  <td style={{ padding: "13px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "3px 10px",
                        borderRadius: "20px",
                        color: STATUS[o.status].color,
                        background: STATUS[o.status].bg,
                      }}
                    >
                      {o.status}
                    </span>
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
