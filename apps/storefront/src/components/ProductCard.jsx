import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import useCartStore from "../store/cartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[0];
    addItem(product, size, 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-50 aspect-[3/4]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600 tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick add — shows on hover */}
        {product.inStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-3 right-3 bg-white text-gray-900 text-sm font-medium
                       py-2 rounded-lg flex items-center justify-center gap-2 opacity-0
                       group-hover:opacity-100 transition-all duration-300 shadow-md
                       hover:bg-gray-900 hover:text-white"
          >
            <ShoppingBag size={15} />
            Quick Add
          </button>
        )}
      </div>

      {/* Product info */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
