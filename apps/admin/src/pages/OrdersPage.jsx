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

const STATUS_STYLES = {
  Delivered: "bg-green-50 text-green-700",
  Shipped: "bg-blue-50 text-blue-700",
  Processing: "bg-amber-50 text-amber-700",
  Cancelled: "bg-rose-50 text-rose-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const filtered =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const updateStatus = (id, status) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-400 mt-1">{filtered.length} orders</p>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                filterStatus === s
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
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
                    className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer}
                    </p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === order.id ? (
                      <select
                        defaultValue={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingId(order.id)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${STATUS_STYLES[order.status]}`}
                        title="Click to change status"
                      >
                        {order.status}
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
