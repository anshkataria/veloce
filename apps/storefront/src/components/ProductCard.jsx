import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";
import { formatCategoryLabel } from "../utils/catalogUtils";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const imageSrc = product.images?.[0] ?? product.imageUrl;
  const variants = product.sizes ??
    product.variants?.split(",") ?? ["Standard"];
  const isInStock =
    typeof product.inStock === "boolean"
      ? product.inStock
      : Number(product.stock ?? 0) > 0;
  const hasOriginalPrice =
    Number(product.originalPrice) > Number(product.price);

  const discount = hasOriginalPrice
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100,
      )
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = variants[0] ?? "Standard";
    const cartProduct = {
      ...product,
      images: imageSrc ? [imageSrc] : [],
      sizes: variants,
      inStock: isInStock,
    };
    addItem(cartProduct, size, 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block fade-in-up">
      <div className="relative overflow-hidden rounded-2xl bg-[#111111] aspect-[3/4] soft-card">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-[#49111c] text-[#f2f4f3] text-[10px] px-2.5 py-1 rounded-full tracking-[0.12em] uppercase">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#a9927d] border border-[#a9927d] text-[#0a0908] text-[10px] px-2.5 py-1 rounded-full tracking-[0.08em]">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-sm font-medium text-white/80 tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick add — shows on hover */}
        {isInStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-3 right-3 bg-[#f2f4f3] text-[#0a0908] text-sm font-medium
                       py-2 rounded-lg flex items-center justify-center gap-2 opacity-0
                       group-hover:opacity-100 transition-all duration-300 shadow-md
                       hover:bg-[#a9927d] hover:text-[#0a0908]"
          >
            <ShoppingBag size={15} />
            Quick Add
          </button>
        )}
      </div>

      {/* Product info */}
      <div className="mt-3 space-y-1.5">
        <p className="text-[11px] text-[#a9927d] tracking-[0.08em]">
          {formatCategoryLabel(product.category)}
        </p>
        <h3 className="text-sm font-medium text-[#f2f4f3] group-hover:text-[#a9927d] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#f2f4f3]">
            {formatPrice(product.price)}
          </span>
          {hasOriginalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
