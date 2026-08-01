import { ShoppingBag, Package, Users, TrendingUp } from "lucide-react";
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
import { groupOrdersByMonth, distinctCustomerCount } from "../utils/orderAnalytics";
import { formatPrice, StatCard, PageHeader, DataTable, StatusBadge, ORDER_STATUS_META } from "@veloce/ui";

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
  const revenueData = groupOrdersByMonth(orders, 6);
  const customerCount = distinctCustomerCount(orders);

  const stats = [
    { label: "REVENUE", value: formatPrice(totalRevenue), icon: TrendingUp },
    { label: "ORDERS", value: orders.length, icon: ShoppingBag },
    { label: "VEHICLES", value: totalCars, icon: Package },
    { label: "CUSTOMERS", value: customerCount, icon: Users },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        subtitle="Live operating view for inventory, revenue, and reservations."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Chart */}
      <div className="soft-card bg-[var(--surface)] border-[var(--veloce-border)] p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-xl font-light tracking-wide text-[var(--ink)]">
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
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-light tracking-wide text-[var(--ink)]">
          Recent Orders
        </h2>
        <span className="text-[11px] font-medium text-[var(--ink-muted)] tracking-widest uppercase">
          {recentOrders.length} latest
        </span>
      </div>
      <DataTable columns={["Order", "Customer", "Amount", "Status"]}>
        {recentOrders.length === 0 ? (
          <DataTable.Empty colSpan={4}>No orders yet</DataTable.Empty>
        ) : (
          recentOrders.map((o, i) => (
            <DataTable.Row key={o.id} isLast={i === recentOrders.length - 1}>
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
                <StatusBadge meta={ORDER_STATUS_META[o.status]} />
              </td>
            </DataTable.Row>
          ))
        )}
      </DataTable>
    </div>
  );
}
