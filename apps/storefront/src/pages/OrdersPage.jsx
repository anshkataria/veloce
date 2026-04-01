import { Link } from "react-router-dom";
import { Package } from "lucide-react";

// Mock orders — will come from API later
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-12-01",
    status: "Delivered",
    total: 8798,
    items: [
      { name: "Ivory Chanderi Suit", size: "M", quantity: 1, price: 3499 },
      { name: "Rose Silk Kurta Set", size: "S", quantity: 1, price: 5299 },
    ],
  },
  {
    id: "ORD-002",
    date: "2025-01-15",
    status: "Shipped",
    total: 4799,
    items: [
      { name: "Sage Green Anarkali", size: "L", quantity: 1, price: 4799 },
    ],
  },
];

const STATUS_STYLES = {
  Delivered: "bg-green-50 text-green-700",
  Shipped: "bg-blue-50 text-blue-700",
  Processing: "bg-amber-50 text-amber-700",
  Cancelled: "bg-rose-50 text-rose-600",
};

export default function OrdersPage() {
  if (mockOrders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Package size={48} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-xl font-light text-gray-900 mb-2">No orders yet</h2>
        <p className="text-sm text-gray-400 mb-8">
          Your order history will appear here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-light text-gray-900 mb-8">Your Orders</h1>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-gray-50 rounded-2xl p-6">
            {/* Order header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} · Size {item.size} · x{item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-sm font-semibold text-gray-900">
                Total: ₹{order.total.toLocaleString("en-IN")}
              </span>
              <button className="text-xs text-gray-400 hover:text-gray-900 underline transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
