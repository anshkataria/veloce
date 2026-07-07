import { Link, useNavigate } from "react-router-dom";
import VeloceArrow from "../components/VeloceArrow";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";
import { getVehicleObjectPosition } from "../utils/vehicleDetails";

function splitVehicleName(product) {
  const brand = product.brand || product.name?.split(" ")[0] || "Vehicle";
  const model = product.name?.startsWith(brand)
    ? product.name.slice(brand.length).trim()
    : product.name;

  return { brand, model: model || product.name };
}

function SelectionVehicle({ item, onRemove }) {
  const { product, size, quantity } = item;
  const { brand, model } = splitVehicleName(product);
  const imageSrc = product.images?.[0] ?? product.imageUrl;
  const metadata = [product.category, size]
    .filter(Boolean)
    .filter((value) => !["standard", "reservation"].includes(value.toLowerCase()))
    .join(" · ");

  return (
    <article className="grid gap-6 border-y border-[var(--brass-line)] py-6 md:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)_minmax(11rem,0.36fr)] md:items-center">
      <Link
        to={`/products/${product.id}`}
        data-cursor="view"
        className="group block overflow-hidden bg-[var(--stone)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)]"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="aspect-[16/10] w-full object-cover transition-transform duration-[520ms] ease-[var(--ease-premium)] group-hover:scale-[1.025]"
            style={{ objectPosition: getVehicleObjectPosition(product.name) }}
          />
        ) : (
          <div className="flex aspect-[16/10] items-center justify-center bg-[var(--stone)] text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Image pending
          </div>
        )}
      </Link>

      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          {brand}
        </p>
        <Link
          to={`/products/${product.id}`}
          data-cursor="link"
          className="mt-3 block text-2xl font-medium leading-tight text-[var(--ink)] transition-colors hover:text-[var(--oxblood)]"
        >
          {model}
        </Link>
        {metadata && (
          <p className="mt-3 text-sm text-[var(--ink-muted)]">{metadata}</p>
        )}
        {quantity > 1 && (
          <p className="mt-3 text-xs text-[var(--ink-muted)]">
            Quantity retained from your saved selection: {quantity}
          </p>
        )}
        <button
          type="button"
          onClick={onRemove}
          data-cursor="remove"
          className="mt-6 text-sm font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--oxblood)]"
        >
          Remove selection
        </button>
      </div>

      <div className="md:text-right">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          Vehicle price
        </p>
        <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--ink)]">
          {formatPrice(product.price * quantity)}
        </p>
      </div>
    </article>
  );
}

export default function CartPage() {
  const { items, removeItem, getTotalPrice } = useCartStore();
  const navigate = useNavigate();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100svh-3.5rem)] bg-[var(--canvas)]">
        <section className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-[clamp(5rem,11vw,9rem)]">
          <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--ink-muted)]">
            Your selection
          </p>
          <h1
            className="mt-4 max-w-2xl text-[clamp(3rem,6vw,5.4rem)] font-light leading-[0.96] text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No vehicle selected
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[var(--ink-muted)]">
            Explore the collection and select a vehicle to begin your reservation.
          </p>
          <Link
            to="/products"
            data-cursor="explore"
            className="group mt-9 inline-flex items-center gap-4 rounded-[8px] bg-[var(--oxblood)] px-6 py-3 text-sm font-semibold text-[var(--surface)] transition-all duration-[320ms] ease-[var(--ease-premium)] hover:bg-[var(--veloce-oxblood-deep)] active:scale-[0.985]"
          >
            Explore the collection
            <VeloceArrow />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100svh-3.5rem)] bg-[var(--canvas)]">
      <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-[clamp(4.5rem,8vw,7rem)]">
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--ink-muted)]">
            Your selection
          </p>
          <h1
            className="mt-4 text-[clamp(3rem,5vw,4.75rem)] font-light leading-[0.98] text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reservation
          </h1>
        </header>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.65fr)_minmax(22rem,0.35fr)] lg:gap-16">
          <section className="space-y-0" aria-label="Selected vehicles">
            {items.map((item) => (
              <SelectionVehicle
                key={`${item.product.id}-${item.size}`}
                item={item}
                onRemove={() => removeItem(item.product.id, item.size)}
              />
            ))}
            <Link
              to="/products"
              data-cursor="link"
              className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-[var(--ink-muted)] transition-colors hover:text-[var(--oxblood)]"
            >
              Continue exploring
              <VeloceArrow className="w-7" />
            </Link>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-y border-[var(--brass-line)] py-7">
              <h2 className="text-lg font-semibold text-[var(--ink)]">
                Reservation Summary
              </h2>

              <div className="mt-6 space-y-5 text-sm">
                <div className="flex items-start justify-between gap-6 text-[var(--ink-muted)]">
                  <span>Vehicle</span>
                  <span className="font-medium tabular-nums text-[var(--ink)]">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-6 text-[var(--ink-muted)]">
                  <span>Delivery</span>
                  <span className="max-w-[11rem] text-right text-[var(--ink)]">
                    Arranged with concierge
                  </span>
                </div>
              </div>

              <div className="mt-7 flex items-baseline justify-between gap-6 border-t border-[var(--brass-line)] pt-6">
                <span className="text-sm font-semibold text-[var(--ink)]">
                  Vehicle total
                </span>
                <span className="text-xl font-semibold tabular-nums text-[var(--ink)]">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                data-cursor="link"
                className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-4 rounded-[8px] bg-[var(--oxblood)] px-6 text-sm font-semibold text-[var(--surface)] transition-all duration-[320ms] ease-[var(--ease-premium)] hover:bg-[var(--veloce-oxblood-deep)] active:scale-[0.985]"
              >
                Continue to reservation
                <VeloceArrow />
              </button>

              <p className="mt-5 text-sm leading-6 text-[var(--ink-muted)]">
                Final delivery and handover details are confirmed during the reservation process.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
