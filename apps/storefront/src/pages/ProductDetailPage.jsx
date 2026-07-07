import { createElement, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck, Wand2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useCartStore from "../store/cartStore";
import { carService } from "../services/carService";
import { formatPrice } from "../utils/formatPrice";
import { getCarImageByName } from "../utils/carImageMap";
import { getDisplayInStock } from "../utils/catalogUtils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const {
    data: car,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carService.getById(id).then((r) => r.data),
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", id],
    queryFn: () => carService.getRelated(id).then((r) => r.data),
    enabled: !!car,
  });

  const imageUrl = car ? getCarImageByName(car.name, car.imageUrl) : "";

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setError("Please select a variant");
      return;
    }
    // adapt car shape to match cart store expectations
    const product = {
      id: car.id,
      name: car.name,
      price: car.price,
      originalPrice: car.originalPrice,
      images: [imageUrl],
      sizes: car.variants?.split(",") ?? [],
    };
    addItem(product, selectedVariant, 1);
    setAdded(true);
    setError("");
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[3/4] bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      </div>
    );

  if (isError || !car)
    return (
      <div className="text-center py-32">
        <p className="text-gray-400">Car not found.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 text-sm underline text-gray-900"
        >
          Back to cars
        </button>
      </div>
    );

  const variants = car.variants?.split(",").map((v) => v.trim()) ?? [];
  const discount = car.originalPrice
    ? Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)
    : 0;
  const isInStock = getDisplayInStock(car.name, car.inStock, car.stock);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#7a6b5f] hover:text-[#17110d] transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="bespoke-frame aspect-[3/4] rounded-[2px] overflow-hidden bg-[#fffaf2] shadow-[0_24px_70px_rgba(49,38,24,0.16)]">
          <img
            src={imageUrl}
            alt={car.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
          />
        </div>

        {/* Details */}
        <div className="bespoke-frame flex flex-col gap-6 luxury-panel rounded-[2px] p-6 lg:p-8">
          <div>
            <p className="text-xs text-[#7a6b5f] uppercase tracking-widest mb-2">
              {car.brand}
            </p>
            <h1
              className="text-3xl sm:text-4xl font-light text-[#17110d] leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {car.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-[#17110d]">
              {formatPrice(car.price)}
            </span>
            {car.originalPrice > car.price && (
              <>
                <span className="text-base text-[#7a6b5f] line-through">
                  {formatPrice(car.originalPrice)}
                </span>
                <span className="text-sm bg-[#f4e4e6] text-[#7f1d2d] px-2 py-0.5 rounded-full font-medium">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-[#5f5148] leading-relaxed">
            {car.description}
          </p>

          <div className="bespoke-frame grid grid-cols-3 rounded-[2px] bg-white/50">
            {[
              ["Category", car.category?.toLowerCase()],
              ["Stock", isInStock ? `${car.stock} ready` : "Unavailable"],
              ["Status", car.isNew ? "New arrival" : "Certified"],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`p-3 ${index > 0 ? "border-l border-[#d7c5aa]" : ""}`}
              >
                <p className="text-[10px] uppercase text-[#7a6b5f]">{label}</p>
                <p className="mt-1 text-xs font-semibold capitalize text-[#17110d]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Variant selector */}
          {variants.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-[#17110d] mb-3">
                Choose configuration
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setSelectedVariant(v);
                      setError("");
                    }}
                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                      selectedVariant === v
                        ? "bg-[#17110d] text-white border-[#17110d]"
                        : "bg-white/60 text-[#5f5148] border-[#d7c5aa] hover:border-[#b59663] hover:text-[#17110d]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-[8px] text-sm font-semibold transition-all ${
              !isInStock
                ? "bg-[#eadcc8] text-[#7a6b5f] cursor-not-allowed"
                : added
                  ? "bg-green-600 text-white"
                  : "bg-[#17110d] text-white hover:bg-[#7f1d2d] hover:-translate-y-0.5"
            }`}
          >
            {added ? (
              <>
                <Check size={16} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag size={16} />{" "}
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </button>

          <div className="grid gap-3 border-t border-[#d7c5aa] pt-6 sm:grid-cols-3">
            {[
              [Truck, "Enclosed delivery"],
              [ShieldCheck, "Verified inventory"],
              [Wand2, "Concierge support"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-2 text-xs text-[#7a6b5f]">
                {createElement(icon, {
                  size: 15,
                  className: "text-[#7f1d2d]",
                })}
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2
            className="text-2xl font-light text-[#17110d] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {related.map((c) => (
              <div
                key={c.id}
                className="cursor-pointer group"
                onClick={() => navigate(`/products/${c.id}`)}
              >
                <img
                  src={getCarImageByName(c.name, c.imageUrl)}
                  alt={c.name}
                  className="w-full aspect-[4/5] object-cover rounded-[10px] border border-[#d7c5aa] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_48px_rgba(49,38,24,0.14)] bg-[#fffaf2]"
                />
                <p className="text-sm font-semibold text-[#17110d] mt-3">
                  {c.name}
                </p>
                <p className="text-sm text-[#7a6b5f]">{formatPrice(c.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
