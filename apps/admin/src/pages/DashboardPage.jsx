import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { createElement } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { carService } from "../services/carService";

const STATUS = {
  DELIVERED: { color: "var(--success)", bg: "var(--success-bg)" },
  CONFIRMED: { color: "var(--info)", bg: "var(--info-bg)" },
  SHIPPED: { color: "var(--info)", bg: "var(--info-bg)" },
  PROCESSING: { color: "var(--warning)", bg: "var(--warning-bg)" },
  CANCELLED: { color: "var(--danger)", bg: "var(--danger-bg)" },
};

const revenueData = [
  { month: "Aug", revenue: 18000000 },
  { month: "Sep", revenue: 24000000 },
  { month: "Oct", revenue: 19000000 },
  { month: "Nov", revenue: 32000000 },
  { month: "Dec", revenue: 45000000 },
  { month: "Jan", revenue: 38000000 },
];

const formatPrice = (v) => {
  const n = Number(v ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
};

export default function DashboardPage() {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => orderService.getAll().then((r) => r.data),
  });

  const { data: carsData } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: () => carService.getAll({ size: 100 }).then((r) => r.data),
  });

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount ?? 0),
    0,
  );
  const totalCars = carsData?.totalElements ?? 0;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "REVENUE",
      value: formatPrice(totalRevenue),
      change: "+18%",
      icon: TrendingUp,
      color: "var(--surface)",
      colorBg: "var(--ink)",
    },
    {
      label: "ORDERS",
      value: orders.length,
      change: "+12%",
      icon: ShoppingBag,
      color: "var(--ink)",
      colorBg: "var(--stone)",
    },
    {
      label: "VEHICLES",
      value: totalCars,
      change: "+3",
      icon: Package,
      color: "var(--surface)",
      colorBg: "var(--oxblood)",
    },
    {
      label: "CUSTOMERS",
      value: "—",
      change: "",
      icon: Users,
      color: "var(--ink)",
      colorBg: "var(--surface)",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-[var(--ink)]">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Live operating view for inventory, revenue, and reservations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, change, icon, color, colorBg }) => (
          <div key={label} className="soft-card p-6 hover-lift bg-[var(--surface)] border-[var(--veloce-border)]">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
                {label}
              </span>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
                style={{ background: colorBg }}
              >
                {createElement(icon, { size: 16, color })}
              </div>
            </div>
            <div className="text-[28px] font-bold tracking-[-0.02em] text-[var(--ink)]">
              {value}
            </div>
            {change && (
              <div className="mt-3 flex items-center gap-1.5">
                <ArrowUpRight size={14} className="text-[var(--success)]" />
                <span className="text-xs font-semibold text-[var(--success)]">
                  {change}
                </span>
                <span className="text-xs text-[var(--ink-muted)]">
                  vs last month
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="soft-card bg-[var(--surface)] border-[var(--veloce-border)] p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-wide text-[var(--ink)]">
            Revenue
          </h2>
          <span className="text-[11px] font-medium text-[var(--ink-muted)] tracking-widest uppercase">
            Last 6 months
          </span>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--oxblood)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--oxblood)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--veloce-line)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--ink-muted)", fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                tickMargin={16}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--ink-muted)", fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatPrice(v)}
                width={80}
              />
              <Tooltip
                formatter={(v) => [formatPrice(v), "Revenue"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--veloce-line)",
                  background: "var(--surface)",
                  color: "var(--ink)",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  boxShadow: "var(--veloce-shadow)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--oxblood)"
                strokeWidth={2}
                fill="url(#grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="soft-card bg-[var(--surface)] border-[var(--veloce-border)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--veloce-line)] px-8 py-6">
          <h2 className="font-display text-xl font-semibold tracking-wide text-[var(--ink)]">
            Recent Orders
          </h2>
          <span className="text-[11px] font-medium text-[var(--ink-muted)] tracking-widest uppercase">
            {recentOrders.length} latest
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--veloce-line)] bg-[var(--stone)]/20">
                {["Order", "Customer", "Amount", "Status"].map((h) => (
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
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-12 text-center text-sm text-[var(--ink-muted)]"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((o, i) => (
                  <tr
                    key={o.id}
                    className={`transition-colors hover:bg-[var(--stone)]/30 ${
                      i < recentOrders.length - 1
                        ? "border-b border-[var(--veloce-line)]"
                        : ""
                    }`}
                  >
                    <td className="px-8 py-5 text-sm font-medium tracking-wide text-[var(--ink)]">
                      ORD-{o.id}
                    </td>
                    <td className="px-8 py-5 text-sm text-[var(--ink-muted)]">
                      {o.shippingName}
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold tracking-wide text-[var(--ink)]">
                      {formatPrice(o.totalAmount)}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className="inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase"
                        style={{
                          color: STATUS[o.status]?.color,
                          background: STATUS[o.status]?.bg,
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
