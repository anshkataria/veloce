import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Gauge, ShoppingBag } from "lucide-react";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";
import { formatCategoryLabel } from "../utils/catalogUtils";
import { softReveal } from "../utils/motionVariants";

const MotionDiv = motion.div;
const MotionImg = motion.img;

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
    <MotionDiv
      variants={softReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/products/${product.id}`}
        className="group block rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b59663]"
      >
      <div className="bespoke-frame relative overflow-hidden rounded-[2px] bg-[#fffaf2] aspect-[4/5] shadow-[0_18px_45px_rgba(49,38,24,0.13)] hover-lift">
        <MotionImg
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17110d]/65 via-[#17110d]/6 to-transparent opacity-70 group-hover:opacity-88 transition-opacity" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.isNew && (
            <span className="bg-[#7f1d2d] text-white text-[10px] px-2.5 py-1 rounded-full uppercase">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#fffaf2] border border-[#b59663] text-[#17110d] text-[10px] px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 rounded-full border border-white/55 bg-white/58 p-2 text-[#17110d] backdrop-blur transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight size={15} />
        </div>

        {/* Out of stock overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-[#17110d]/58 flex items-center justify-center">
            <span className="text-sm font-medium text-white/90 tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick add — shows on hover */}
        {isInStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-3 right-3 bg-[#17110d] text-white text-sm font-semibold
                       py-2.5 rounded-[8px] flex items-center justify-center gap-2 opacity-0 translate-y-2
                       group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md
                       hover:bg-[#7f1d2d]"
          >
            <ShoppingBag size={15} />
            Quick Add
          </button>
        )}

        <div className="absolute bottom-3 left-3 right-3 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
          <div className="flex items-center justify-between gap-3 text-[11px] text-white/88">
            <span className="inline-flex items-center gap-1.5">
              <Gauge size={13} />
              {product.brand}
            </span>
            <span>{Number(product.stock ?? 0)} available</span>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-4 space-y-2">
        <p className="text-[11px] text-[#7a6b5f] uppercase">
          {formatCategoryLabel(product.category)}
        </p>
        <h3 className="text-base font-semibold text-[#17110d] group-hover:text-[#7f1d2d] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold text-[#17110d] font-mono">
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
    </MotionDiv>
  );
}
