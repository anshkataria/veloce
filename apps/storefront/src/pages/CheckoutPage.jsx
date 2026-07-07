import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VeloceArrow from "../components/VeloceArrow";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";
import { orderService } from "../services/orderService";
import { getVehicleObjectPosition } from "../utils/vehicleDetails";
import { formatCategoryLabel } from "../utils/catalogUtils";

function splitVehicleName(product) {
  const brand = product.brand || product.name?.split(" ")[0] || "Vehicle";
  const model = product.name?.startsWith(brand)
    ? product.name.slice(brand.length).trim()
    : product.name;

  return { brand, model: model || product.name };
}

function CheckoutField({ field, value, onChange, error }) {
  const spanClass = field.col === 2 ? "sm:col-span-2" : "";

  return (
    <div className={spanClass}>
      <label
        htmlFor={field.name}
        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]"
      >
        {field.label}
      </label>
      <input
        id={field.name}
        type={field.type}
        name={field.name}
        value={value}
        onChange={onChange}
        autoComplete={field.autoComplete}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${field.name}-error` : undefined}
        className={`h-13 min-h-[52px] w-full rounded-[8px] border bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] px-4 text-sm text-[var(--ink)] outline-none transition-colors duration-[260ms] ease-[var(--ease-premium)] hover:border-[var(--ink-muted)] focus:border-[var(--oxblood)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--oxblood)_16%,transparent)] ${
          error ? "border-[#a93d45]" : "border-[var(--brass-line-strong)]"
        }`}
      />
      {error && (
        <p id={`${field.name}-error`} className="mt-2 text-xs text-[#a93d45]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
    setFieldErrors((current) => ({ ...current, [event.target.name]: "" }));
  };

  const total = getTotalPrice();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, navigate]);

  const handleConfirmReservation = async (event) => {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("veloce_token");
    if (!token) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const requiredErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) requiredErrors[key] = "Required.";
    });

    if (Object.keys(requiredErrors).length > 0) {
      setFieldErrors(requiredErrors);
      setError("Complete the required client details.");
      return;
    }

    const payload = {
      shippingName: form.name.trim(),
      shippingEmail: form.email.trim(),
      shippingPhone: form.phone.trim(),
      shippingAddress: form.address.trim(),
      shippingCity: form.city.trim(),
      shippingState: form.state.trim(),
      shippingPincode: form.pincode.trim(),
      items: items.map(({ product, size, quantity }) => ({
        carId: product.id,
        variant: size,
        quantity,
      })),
    };

    try {
      setIsSubmitting(true);
      await orderService.create(payload);
      clearCart();
      navigate("/orders", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "We couldn't confirm this reservation. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  const fields = [
    { label: "Full name", name: "name", type: "text", col: 2, autoComplete: "name" },
    { label: "Email", name: "email", type: "email", col: 1, autoComplete: "email" },
    { label: "Phone", name: "phone", type: "tel", col: 1, autoComplete: "tel" },
    { label: "Address", name: "address", type: "text", col: 2, autoComplete: "street-address" },
    { label: "City", name: "city", type: "text", col: 1, autoComplete: "address-level2" },
    { label: "State", name: "state", type: "text", col: 1, autoComplete: "address-level1" },
    { label: "Postcode", name: "pincode", type: "text", col: 1, autoComplete: "postal-code" },
  ];

  return (
    <main className="bg-[var(--canvas)]">
      <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-[clamp(3.5rem,7vw,6rem)]">
        <header className="mb-9">
          <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--ink-muted)]">
            Secure handoff
          </p>
          <h1
            className="mt-4 text-[clamp(2.85rem,5vw,4.75rem)] font-light leading-[0.98] text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reservation Details
          </h1>
        </header>

        <form onSubmit={handleConfirmReservation}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.64fr)_minmax(22rem,0.36fr)] lg:gap-16">
            <section className="min-w-0">
              <div className="border-y border-[var(--brass-line)] py-7">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">
                  Client Details
                </h2>

                {error && (
                  <p
                    role="alert"
                    className="mt-5 border-l-2 border-[#a93d45] py-1 pl-3 text-sm text-[#a93d45]"
                  >
                    {error}
                  </p>
                )}

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {fields.map((field) => (
                    <CheckoutField
                      key={field.name}
                      field={field}
                      value={form[field.name]}
                      onChange={handleChange}
                      error={fieldErrors[field.name]}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 border-y border-[var(--brass-line)] py-7">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">
                  Reservation Process
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-muted)]">
                  No payment is collected at this stage. Availability, delivery, and
                  handoff details are confirmed after submission.
                </p>
              </div>
            </section>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border-y border-[var(--brass-line)] py-7">
                <h2 className="text-lg font-semibold text-[var(--ink)]">
                  Reservation Summary
                </h2>

                <div className="mt-6 space-y-6">
                  {items.map(({ product }) => {
                    const { brand, model } = splitVehicleName(product);
                    const imageSrc = product.images?.[0] ?? product.imageUrl;

                    return (
                      <div key={product.id} className="grid gap-4">
                        {imageSrc && (
                          <Link
                            to={`/products/${product.id}`}
                            data-cursor="view"
                            className="group block overflow-hidden bg-[var(--stone)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)]"
                          >
                            <img
                              src={imageSrc}
                              alt={product.name}
                              className="aspect-[16/10] w-full object-cover transition-transform duration-[520ms] ease-[var(--ease-premium)] group-hover:scale-[1.025]"
                              style={{ objectPosition: getVehicleObjectPosition(product.name) }}
                            />
                          </Link>
                        )}
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                            {brand}
                          </p>
                          <Link
                            to={`/products/${product.id}`}
                            data-cursor="link"
                            className="mt-2 block text-xl font-medium leading-tight text-[var(--ink)] transition-colors hover:text-[var(--oxblood)]"
                          >
                            {model}
                          </Link>
                          {product.category && (
                            <p className="mt-2 text-sm text-[var(--ink-muted)]">
                              {formatCategoryLabel(product.category)}
                            </p>
                          )}
                          <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                            Vehicle price
                          </p>
                          <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--ink)]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-7 space-y-4 border-t border-[var(--brass-line)] pt-6 text-sm">
                  <div className="flex items-start justify-between gap-6 text-[var(--ink-muted)]">
                    <span>Vehicle price</span>
                    <span className="font-medium tabular-nums text-[var(--ink)]">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-6 text-[var(--ink-muted)]">
                    <span>Delivery handoff</span>
                    <span className="max-w-[11rem] text-right text-[var(--ink)]">
                      Arranged with concierge
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 border-t border-[var(--brass-line)] pt-5 font-semibold text-[var(--ink)]">
                    <span>Total</span>
                    <span className="text-xl tabular-nums">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-cursor="link"
                  className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-4 rounded-[8px] bg-[var(--oxblood)] px-6 text-sm font-semibold text-[var(--surface)] transition-all duration-[320ms] ease-[var(--ease-premium)] hover:bg-[var(--veloce-oxblood-deep)] active:scale-[0.985] disabled:opacity-70"
                >
                  {isSubmitting ? "Confirming..." : "Confirm Reservation"}
                  {!isSubmitting && <VeloceArrow />}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}
