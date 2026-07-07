import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center fade-in-up">
        <ShoppingBag size={48} className="mx-auto text-[#d7c5aa] mb-4" />
        <h2 className="text-xl font-light text-[#17110d] mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-[#7a6b5f] mb-8">
          Reserve a vehicle from the current inventory to begin checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 luxury-btn px-6 py-3 rounded-[8px] text-sm font-semibold"
        >
          View Inventory
        </Link>
      </div>
    );
  }

  const total = getTotalPrice();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
      <div className="mb-8">
        <p className="luxury-chip mb-3">Your Selection</p>
        <h1 className="text-3xl font-light text-[#17110d]">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── CART ITEMS ── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, size, quantity }) => (
            <div
              key={`${product.id}-${size}`}
              className="bespoke-frame flex gap-4 p-4 luxury-panel rounded-[2px] hover-lift"
            >
              {/* Image */}
              <Link to={`/products/${product.id}`} className="flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-32 object-cover rounded-[10px] border border-[#d7c5aa]"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/products/${product.id}`}
                    className="text-sm font-semibold text-[#17110d] hover:text-[#7f1d2d] transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-[#7a6b5f] mt-1">Variant: {size}</p>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 border border-[#d7c5aa] rounded-full px-2 py-1 bg-white/70">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, size, quantity - 1)
                      }
                      className="p-1 text-[#7a6b5f] hover:text-[#17110d] transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center text-[#17110d]">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, size, quantity + 1)
                      }
                      className="p-1 text-[#7a6b5f] hover:text-[#17110d] transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Price + delete */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#17110d]">
                      {formatPrice(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(product.id, size)}
                      className="text-[#b8aa98] hover:text-[#7f1d2d] transition-colors"
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
          <div className="bespoke-frame luxury-panel rounded-[2px] p-6 sticky top-24 space-y-4">
            <h2 className="text-base font-semibold text-[#17110d]">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
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
              {shipping > 0 && (
                <p className="text-xs text-[#7a6b5f]">
                  Add {formatPrice(999 - total)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-[#d7c5aa] pt-4 flex justify-between font-semibold text-[#17110d]">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full luxury-btn py-3.5 rounded-[8px] text-sm font-semibold"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-[#7a6b5f] hover:text-[#17110d] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
