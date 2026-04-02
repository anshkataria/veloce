import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";

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

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const total = getTotalPrice();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const empty = Object.values(form).some((v) => !v.trim());
    if (empty) {
      setError("Please fill in all fields");
      return;
    }
    // TODO: call order API + Razorpay
    console.log("Placing order:", { form, items, grandTotal });
    clearCart();
    navigate("/orders");
  };

  if (items.length === 0) {
    navigate("/cart");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-light text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── SHIPPING FORM ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-5">
                Shipping Details
              </h2>

              {error && (
                <div className="bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.col === 2 ? "col-span-2" : "col-span-1"}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                                 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment placeholder */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">
                Payment
              </h2>
              <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center text-sm text-gray-400">
                Razorpay integration coming after backend is ready
              </div>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-4">
              <h2 className="text-base font-medium text-gray-900">
                Your Order
              </h2>

              <div className="space-y-3">
                {items.map(({ product, size, quantity }) => (
                  <div key={`${product.id}-${size}`} className="flex gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-18 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Size: {size} · Qty: {quantity}
                      </p>
                      <p className="text-xs font-semibold text-gray-900 mt-1">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3.5 rounded-full text-sm font-medium
                           hover:bg-gray-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
