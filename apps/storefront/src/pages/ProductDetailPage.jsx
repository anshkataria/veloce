import { createElement, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Check,
  Cog,
  Gauge,
  Route,
  ShieldCheck,
  ShoppingBag,
  Timer,
  Truck,
  Wand2,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useCartStore from "../store/cartStore";
import { carService } from "../services/carService";
import { formatPrice } from "../utils/formatPrice";
import { getCarImageByName } from "../utils/carImageMap";
import { formatCategoryLabel, getDisplayInStock } from "../utils/catalogUtils";
import { fadeUp, softReveal, staggerContainer } from "../utils/motionVariants";
import { getVehicleGallery, getVehicleSpecs } from "../utils/vehicleDetails";

const MotionDiv = motion.div;
const MotionImg = motion.img;
const MotionSpan = motion.span;

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
    if (!activeVariant) {
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
    addItem(product, activeVariant, 1);
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

  const variants =
    car.variants
      ?.split(",")
      .map((v) => v.trim())
      .filter(Boolean) ?? [];
  const discount = car.originalPrice
    ? Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)
    : 0;
  const isInStock = getDisplayInStock(car.name, car.inStock, car.stock);
  const activeVariant = variants.includes(selectedVariant)
    ? selectedVariant
    : null;
  const gallery = getVehicleGallery(car.name, imageUrl);
  const selectedImage = gallery[selectedImageIndex] ?? gallery[0];
  const specs = getVehicleSpecs(car.name, car.category);
  const specHighlights = [
    [Zap, "Power", specs.horsepower],
    [Timer, "0-100 km/h", specs.acceleration],
    [Gauge, "Top speed", specs.topSpeed],
  ];
  const specGrid = [
    [Activity, "Engine", specs.engine],
    [Zap, "Horsepower", specs.horsepower],
    [Timer, "0-100 km/h", specs.acceleration],
    [Cog, "Transmission", specs.transmission],
    [Route, "Drivetrain", specs.drivetrain],
    [Gauge, "Top speed", specs.topSpeed],
  ];

  return (
    <MotionDiv
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#7a6b5f] hover:text-[#17110d] transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_430px] lg:gap-12">
        <MotionDiv className="space-y-4" variants={softReveal}>
          <div className="bespoke-frame relative aspect-[16/11] overflow-hidden rounded-[2px] bg-[#fffaf2] shadow-[0_24px_70px_rgba(49,38,24,0.16)] sm:aspect-[16/10]">
            <AnimatePresence mode="wait">
              <MotionImg
                key={selectedImage.label}
                src={selectedImage.src}
                alt={`${car.name} ${selectedImage.label}`}
                className="h-full w-full object-cover"
                style={{ objectPosition: selectedImage.objectPosition }}
                initial={{ opacity: 0, scale: 1.06, clipPath: "inset(0 0 12% 0)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#17110d]/45 via-transparent to-white/10" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/75">
                  Gallery View
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {selectedImage.label}
                </p>
              </div>
              <p className="hidden max-w-[15rem] text-right text-xs text-white/78 sm:block">
                {selectedImage.note}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {gallery.map((item, index) => {
              const active = selectedImageIndex === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  aria-pressed={active}
                  className={`group overflow-hidden rounded-[2px] border bg-[#fffaf2] text-left transition-all ${
                    active
                      ? "border-[#17110d] shadow-[0_14px_34px_rgba(49,38,24,0.14)]"
                      : "border-[#d7c5aa] hover:border-[#b59663]"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={`${car.name} ${item.label} thumbnail`}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: item.objectPosition }}
                  />
                  <span className="block px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#17110d]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {specHighlights.map(([icon, label, value]) => (
              <div
                key={label}
                className="bespoke-frame rounded-[2px] bg-white/55 p-4"
              >
                <div className="mb-3 inline-flex rounded-lg border border-[#d7c5aa] bg-[#fffaf2] p-2 text-[#7f1d2d]">
                  {createElement(icon, { size: 16 })}
                </div>
                <p className="text-[10px] uppercase text-[#7a6b5f]">{label}</p>
                <p className="mt-1 text-sm font-semibold text-[#17110d]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </MotionDiv>

        <MotionDiv
          className="bespoke-frame luxury-panel rounded-[2px] p-6 lg:sticky lg:top-24 lg:self-start"
          variants={fadeUp}
        >
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#d7c5aa] bg-white/55 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#7a6b5f]">
                  {car.brand}
                </span>
                <span className="rounded-full border border-[#d7c5aa] bg-white/55 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#7a6b5f]">
                  {formatCategoryLabel(car.category)}
                </span>
              </div>
              <h1
                className="text-3xl font-light leading-snug text-[#17110d] sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {car.name}
              </h1>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-semibold text-[#17110d]">
                  {formatPrice(car.price)}
                </span>
                {car.originalPrice > car.price && (
                  <>
                    <span className="text-base text-[#7a6b5f] line-through">
                      {formatPrice(car.originalPrice)}
                    </span>
                    <span className="rounded-full bg-[#f4e4e6] px-2 py-0.5 text-sm font-medium text-[#7f1d2d]">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#7a6b5f]">
                Reservation price
              </p>
            </div>

            <p className="text-sm leading-7 text-[#5f5148]">
              {car.description}
            </p>

            <div className="bespoke-frame grid grid-cols-3 rounded-[2px] bg-white/50">
              {[
                ["Stock", isInStock ? `${car.stock} ready` : "Unavailable"],
                ["Status", car.isNew ? "New arrival" : "Certified"],
                ["Handoff", "Concierge"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`p-3 ${index > 0 ? "border-l border-[#d7c5aa]" : ""}`}
                >
                  <p className="text-[10px] uppercase text-[#7a6b5f]">
                    {label}
                  </p>
                  <p className="mt-1 text-xs font-semibold capitalize text-[#17110d]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {variants.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold text-[#17110d]">
                  Choose configuration
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setSelectedVariant(v);
                        setError("");
                      }}
                      className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                        activeVariant === v
                          ? "border-[#17110d] bg-[#17110d] text-white"
                          : "border-[#d7c5aa] bg-white/60 text-[#5f5148] hover:border-[#b59663] hover:text-[#17110d]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`flex w-full items-center justify-center gap-2 rounded-[8px] py-3.5 text-sm font-semibold transition-all ${
                !isInStock
                  ? "cursor-not-allowed bg-[#eadcc8] text-[#7a6b5f]"
                  : added
                    ? "bg-green-600 text-white"
                    : "bg-[#17110d] text-white hover:-translate-y-0.5 hover:bg-[#7f1d2d]"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <MotionSpan
                  key={added ? "added" : "idle"}
                  className="inline-flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {added ? (
                    <>
                      <Check size={16} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />{" "}
                      {isInStock ? "Reserve Vehicle" : "Out of Stock"}
                    </>
                  )}
                </MotionSpan>
              </AnimatePresence>
            </button>

            <div className="grid gap-3 border-t border-[#d7c5aa] pt-6 sm:grid-cols-3">
              {[
                [Truck, "Enclosed delivery"],
                [ShieldCheck, "Verified inventory"],
                [Wand2, "Concierge support"],
              ].map(([icon, text]) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-xs text-[#7a6b5f]"
                >
                  {createElement(icon, {
                    size: 15,
                    className: "text-[#7f1d2d]",
                  })}
                  {text}
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>
      </div>

      <MotionDiv
        className="mt-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="luxury-chip mb-3">Vehicle Specification</p>
            <h2
              className="text-3xl font-light text-[#17110d]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Performance and configuration
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#5f5148]">
            Core figures are presented for quick inspection before the full
            concierge handoff and verification workflow.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {specGrid.map(([icon, label, value]) => (
            <div
              key={label}
              className="bespoke-frame flex items-start gap-4 rounded-[2px] bg-[#fffaf2]/80 p-5 hover-lift"
            >
              <div className="rounded-lg border border-[#d7c5aa] bg-white/65 p-2 text-[#7f1d2d]">
                {createElement(icon, { size: 18 })}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#7a6b5f]">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#17110d]">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MotionDiv>

      {/* Related */}
      {related.length > 0 && (
        <MotionDiv
          className="mt-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
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
        </MotionDiv>
      )}
    </MotionDiv>
  );
}
