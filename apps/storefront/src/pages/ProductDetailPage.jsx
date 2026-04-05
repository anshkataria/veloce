import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useCartStore from "../store/cartStore";
import { carService } from "../services/carService";
import { formatPrice } from "../utils/formatPrice";

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
      images: [car.imageUrl],
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50">
          <img
            src={car.imageUrl}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
              {car.brand}
            </p>
            <h1
              className="text-2xl sm:text-3xl font-light text-gray-900 leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {car.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-gray-900">
              {formatPrice(car.price)}
            </span>
            {car.originalPrice > car.price && (
              <>
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(car.originalPrice)}
                </span>
                <span className="text-sm bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {car.description}
          </p>

          {/* Variant selector */}
          {variants.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">
                Select Variant
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
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
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
            disabled={!car.inStock}
            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-medium transition-all ${
              !car.inStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : added
                  ? "bg-green-600 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {added ? (
              <>
                <Check size={16} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag size={16} />{" "}
                {car.inStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </button>

          <div className="border-t border-gray-100 pt-6 space-y-2">
            <p className="text-xs text-gray-400">
              White-glove pan-India delivery
            </p>
            <p className="text-xs text-gray-400">7-day hassle-free returns</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2
            className="text-xl font-light text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            You may also like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((c) => (
              <div
                key={c.id}
                className="cursor-pointer"
                onClick={() => navigate(`/products/${c.id}`)}
              >
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="w-full aspect-[3/4] object-cover rounded-xl hover:opacity-80 transition-opacity bg-gray-50"
                />
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {c.name}
                </p>
                <p className="text-sm text-gray-500">{formatPrice(c.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
