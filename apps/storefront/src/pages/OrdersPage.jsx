import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { formatPrice, StatusBadge, ORDER_STATUS_META } from "@veloce/ui";
import VeloceArrow from "../components/VeloceArrow";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: () => orderService.getMyOrders().then((r) => r.data),
  });

  if (isLoading)
    return (
      <main className="min-h-[calc(100svh-3.5rem)] bg-[var(--canvas)]">
        <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-[clamp(4.5rem,8vw,7rem)] space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-[8px] bg-[var(--stone)]/40" />
          ))}
        </div>
      </main>
    );

  if (orders.length === 0)
    return (
      <main className="min-h-[calc(100svh-3.5rem)] bg-[var(--canvas)]">
        <section className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-[clamp(5rem,11vw,9rem)] text-center">
          <Package size={40} className="mx-auto mb-6 text-[var(--veloce-border)]" />
          <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--ink-muted)]">
            Your orders
          </p>
          <h1
            className="mt-4 text-[clamp(3rem,6vw,5.4rem)] font-light leading-[0.96] text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No orders yet
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base leading-7 text-[var(--ink-muted)]">
            Your order history will appear here once you complete a reservation.
          </p>
          <Link
            to="/products"
            data-cursor="explore"
            className="group mt-9 inline-flex items-center gap-4 rounded-[8px] bg-[var(--oxblood)] px-6 py-3 text-sm font-semibold text-[var(--surface)] transition-all duration-[320ms] ease-[var(--ease-premium)] hover:bg-[var(--veloce-oxblood-deep)] active:scale-[0.985]"
          >
            Browse the collection
            <VeloceArrow />
          </Link>
        </section>
      </main>
    );

  return (
    <main className="min-h-[calc(100svh-3.5rem)] bg-[var(--canvas)]">
      <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-[clamp(4.5rem,8vw,7rem)]">
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--ink-muted)]">
            Order history
          </p>
          <h1
            className="mt-4 text-[clamp(3rem,5vw,4.75rem)] font-light leading-[0.98] text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Orders
          </h1>
        </header>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="soft-card p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    ORD-{order.id}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <StatusBadge meta={ORDER_STATUS_META[order.status]} />
              </div>

              <div className="mb-4 space-y-2 border-y border-[var(--brass-line)] py-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[var(--ink-muted)]">
                      {item.car.name} · {item.variant} · x{item.quantity}
                    </span>
                    <span className="font-medium text-[var(--ink)]">
                      {formatPrice(item.priceAtPurchase)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">
                  Total: {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
