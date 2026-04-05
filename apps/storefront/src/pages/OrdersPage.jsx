import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";

const STATUS_STYLES = {
  DELIVERED: "bg-green-50 text-green-700",
  SHIPPED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-purple-50 text-purple-700",
  CANCELLED: "bg-rose-50 text-rose-600",
};

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: () => orderService.getMyOrders().then((r) => r.data),
  });

  if (isLoading)
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-32" />
        ))}
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Package size={48} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-xl font-light text-gray-900 mb-2">No orders yet</h2>
        <p className="text-sm text-gray-400 mb-8">
          Your order history will appear here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Browse Cars
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1
        className="text-2xl font-light text-gray-900 mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Your Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ORD-{order.id}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
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

            <div className="space-y-2 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.car.name} · {item.variant} · x{item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatPrice(item.priceAtPurchase)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-sm font-semibold text-gray-900">
                Total: {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
