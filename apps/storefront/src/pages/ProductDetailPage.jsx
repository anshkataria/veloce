import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Check } from "lucide-react";
import useCartStore from "../store/cartStore";
import { mockProducts } from "../data/mockProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const product = mockProducts.find((p) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-400">Product not found.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 text-sm underline text-gray-900"
        >
          Back to products
        </button>
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    addItem(product, selectedSize, 1);
    setAdded(true);
    setError("");
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* ── IMAGE ── */}
        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ── DETAILS ── */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-sm bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-900">Select Size</p>
              <button className="text-xs text-gray-400 underline hover:text-gray-900 transition-colors">
                Size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setError("");
                  }}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    selectedSize === size
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
          </div>

          {/* Add to cart */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-medium transition-all ${
                !product.inStock
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
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </button>
          </div>

          {/* Meta info */}
          <div className="border-t border-gray-100 pt-6 space-y-2">
            <p className="text-xs text-gray-400">
              Free shipping on orders above ₹999
            </p>
            <p className="text-xs text-gray-400">Easy 7-day returns</p>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-16">
        <h2 className="text-xl font-light text-gray-900 mb-6">
          You may also like
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockProducts
            .filter(
              (p) => p.id !== product.id && p.category === product.category,
            )
            .slice(0, 4)
            .map((p) => (
              <div key={p.id}>
                <img
                  src={p.images[0]}
                  alt={p.name}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="w-full aspect-[3/4] object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity bg-gray-50"
                />
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {p.name}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
