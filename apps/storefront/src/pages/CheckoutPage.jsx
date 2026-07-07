import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";
import { orderService } from "../services/orderService";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const total = getTotalPrice();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [items.length, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("veloce_token");
    if (!token) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const empty = Object.values(form).some((v) => !v.trim());
    if (empty) {
      setError("Please fill in all fields");
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
          "We couldn't place your order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  const fields = [
    { label: "Full Name", name: "name", type: "text", col: 2 },
    { label: "Email", name: "email", type: "email", col: 1 },
    { label: "Phone", name: "phone", type: "tel", col: 1 },
    { label: "Address", name: "address", type: "text", col: 2 },
    { label: "City", name: "city", type: "text", col: 1 },
    { label: "State", name: "state", type: "text", col: 1 },
    { label: "Pincode", name: "pincode", type: "text", col: 1 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
      <div className="mb-8">
        <p className="luxury-chip mb-3">Secure Handoff</p>
        <h1 className="text-3xl font-light text-[#17110d]">Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── SHIPPING FORM ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bespoke-frame luxury-panel rounded-[2px] p-6">
              <h2 className="text-sm font-semibold text-[#17110d] uppercase tracking-wide mb-5">
                Shipping Details
              </h2>

              {error && (
                <div className="bg-[#f4e4e6] text-[#7f1d2d] text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.col === 2 ? "col-span-2" : "col-span-1"}
                  >
                    <label className="block text-xs font-semibold text-[#5f5148] mb-1.5 uppercase tracking-wide">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full border border-[#d7c5aa] rounded-[10px] px-4 py-3 text-sm text-[#17110d]
                                 focus:outline-none focus:ring-1 focus:ring-[#b59663] bg-white/75 transition-shadow"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bespoke-frame luxury-panel rounded-[2px] p-6">
              <h2 className="text-sm font-semibold text-[#17110d] uppercase tracking-wide mb-3">
                Payment
              </h2>
              <div className="bespoke-frame rounded-[2px] bg-white/45 p-4 text-center text-sm text-[#7a6b5f]">
                Reservation orders are recorded after account verification. A
                payment provider can be connected before public launch.
              </div>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="lg:col-span-1">
            <div className="bespoke-frame luxury-panel rounded-[2px] p-6 sticky top-24 space-y-4">
              <h2 className="text-base font-semibold text-[#17110d]">
                Your Order
              </h2>

              <div className="space-y-3">
                {items.map(({ product, size, quantity }) => (
                  <div key={`${product.id}-${size}`} className="flex gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-18 object-cover rounded-lg flex-shrink-0 border border-[#d7c5aa]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#17110d] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#7a6b5f] mt-0.5">
                        Variant: {size} · Qty: {quantity}
                      </p>
                      <p className="text-xs font-semibold text-[#17110d] mt-1">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#d7c5aa] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#5f5148]">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[#5f5148]">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-[#17110d] pt-2 border-t border-[#d7c5aa]">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full luxury-btn py-3.5 rounded-[8px] text-sm font-semibold
                           disabled:cursor-not-allowed disabled:bg-[#d7c5aa] disabled:border-[#d7c5aa]"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
