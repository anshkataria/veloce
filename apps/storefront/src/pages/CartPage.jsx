import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-xl font-light text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          Looks like you haven't added anything yet.
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

  const total = getTotalPrice();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-light text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── CART ITEMS ── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, size, quantity }) => (
            <div
              key={`${product.id}-${size}`}
              className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
            >
              {/* Image */}
              <Link to={`/products/${product.id}`} className="flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-32 object-cover rounded-xl"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/products/${product.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-1">Size: {size}</p>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 bg-white">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, size, quantity - 1)
                      }
                      className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, size, quantity + 1)
                      }
                      className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Price + delete */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(product.id, size)}
                      className="text-gray-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ORDER SUMMARY ── */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-4">
            <h2 className="text-base font-medium text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
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
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add {formatPrice(999 - total)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gray-900 text-white py-3.5 rounded-full text-sm font-medium
                         hover:bg-gray-700 transition-colors"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-gray-400 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
