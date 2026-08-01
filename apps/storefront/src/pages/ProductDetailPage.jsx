import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import VeloceArrow from "../components/VeloceArrow";
import useCartStore from "../store/cartStore";
import { carService } from "../services/carService";
import { formatPrice } from "../utils/formatPrice";
import { getCarImageByName } from "../utils/carImageMap";
import { formatCategoryLabel, getDisplayInStock } from "../utils/catalogUtils";
import { fadeUp, softReveal, staggerContainer } from "../utils/motionVariants";
import {
  getVehicleGallery,
  getVehicleObjectPosition,
  getVehicleSpecs,
} from "../utils/vehicleDetails";

const MotionDiv = motion.div;
const MotionImg = motion.img;
const MotionSection = motion.section;
const MotionSpan = motion.span;

function splitVehicleName(car) {
  const brand = car.brand || car.name?.split(" ")[0] || "Vehicle";
  const model = car.name?.startsWith(brand)
    ? car.name.slice(brand.length).trim()
    : car.name;

  return { brand, model: model || car.name };
}

function BackArrow({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 34 12"
      fill="none"
      className={`h-3 w-8 transition-transform duration-[320ms] ease-[var(--ease-premium)] group-hover:-translate-x-1 ${className}`}
    >
      <path
        d="M33 6H3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.5 1.5L3 6L7.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M7 7L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 7L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function buildStory(car, specs) {
  const category = formatCategoryLabel(car.category).toLowerCase();
  const description = car.description?.trim();

  if (description) {
    return [description];
  }

  return [
    `${car.name} is presented as part of the current ${category} selection, pairing ${specs.engine.toLowerCase()} with ${specs.transmission.toLowerCase()}.`,
  ];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [brokenImages, setBrokenImages] = useState(() => new Set());

  const markImageBroken = (src) =>
    setBrokenImages((current) => {
      if (current.has(src)) return current;
      const next = new Set(current);
      next.add(src);
      return next;
    });

  const {
    data: car,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carService.getById(id).then((response) => response.data),
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", id],
    queryFn: () => carService.getRelated(id).then((response) => response.data),
    enabled: !!car,
  });

  const imageUrl = car ? getCarImageByName(car.name, car.imageUrl) : "";
  const normalizedImages = useMemo(() => {
    if (!car) return [];
    const sourceImages = Array.isArray(car.images) ? car.images : [];
    return sourceImages.map((src) => getCarImageByName(car.name, src));
  }, [car]);

  const gallery = car
    ? getVehicleGallery(car.name, imageUrl, normalizedImages)
    : [];
  const currentImageIndex = gallery[selectedImageIndex] ? selectedImageIndex : 0;
  const selectedImage = gallery[currentImageIndex] ?? gallery[0];
  const specs = car ? getVehicleSpecs(car.name, car.category) : null;
  const isInStock = car
    ? getDisplayInStock(car.name, car.inStock, car.stock)
    : false;
  const variants =
    car?.variants
      ?.split(",")
      .map((variant) => variant.trim())
      .filter(Boolean) ?? [];

  useEffect(() => {
    if (!viewerOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setViewerOpen(false);
      if (event.key === "ArrowRight") {
        setSelectedImageIndex((index) => (index + 1) % gallery.length);
      }
      if (event.key === "ArrowLeft") {
        setSelectedImageIndex((index) => (index - 1 + gallery.length) % gallery.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [gallery.length, viewerOpen]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-16">
        <div className="grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.9fr)]">
          <div className="aspect-[16/10] bg-[var(--stone)]" />
          <div className="space-y-5">
            <div className="h-3 w-28 rounded bg-[var(--brass-line-strong)]" />
            <div className="h-12 w-3/4 rounded bg-[var(--brass-line-strong)]" />
            <div className="h-6 w-36 rounded bg-[var(--stone)]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !car || !specs) {
    return (
      <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-32">
        <p className="text-sm text-[var(--ink-muted)]">Vehicle not found.</p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          data-cursor="link"
          className="group mt-5 inline-flex items-center gap-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--oxblood)]"
        >
          <BackArrow />
          Back to collection
        </button>
      </div>
    );
  }

  const { brand, model } = splitVehicleName(car);
  const categoryLabel = formatCategoryLabel(car.category);
  const story = buildStory(car, specs);
  const specificationRows = [
    ["Engine", specs.engine],
    ["Power", specs.horsepower],
    ["Acceleration", specs.acceleration, "0-100 km/h"],
    ["Top speed", specs.topSpeed],
    ["Transmission", specs.transmission],
    ["Drivetrain", specs.drivetrain],
  ];
  const relatedVehicles = related
    .filter((item) => String(item.id) !== String(car.id))
    .slice(0, 3)
    .map((item) => ({
      ...item,
      imageUrl: getCarImageByName(item.name, item.imageUrl),
      inStock: getDisplayInStock(item.name, item.inStock, item.stock),
    }));

  const handleReserve = () => {
    const reservationVariant = variants[0] ?? "Reservation";
    addItem(
      {
        id: car.id,
        name: car.name,
        price: car.price,
        originalPrice: car.originalPrice,
        images: imageUrl ? [imageUrl] : [],
        sizes: variants.length > 0 ? variants : [reservationVariant],
        inStock: isInStock,
      },
      reservationVariant,
      1,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <MotionDiv
      className="bg-[var(--canvas)]"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] pb-[var(--section-space-medium)] pt-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          data-cursor="link"
          className="group mb-9 inline-flex items-center gap-3 text-sm font-semibold text-[var(--ink-muted)] transition-colors duration-[260ms] ease-[var(--ease-premium)] hover:text-[var(--oxblood)]"
        >
          <BackArrow />
          <span className="transition-transform duration-[260ms] ease-[var(--ease-premium)] group-hover:-translate-x-0.5">
            Back to collection
          </span>
        </button>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.9fr)] lg:gap-14">
          <MotionDiv variants={softReveal}>
            <button
              type="button"
              onClick={() => setViewerOpen(true)}
              data-cursor="expand"
              className="group block w-full overflow-hidden bg-[var(--stone)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)]"
              aria-label={`Expand image of ${car.name}`}
            >
              {selectedImage?.src && !brokenImages.has(selectedImage.src) ? (
                <AnimatePresence mode="wait">
                  <MotionImg
                    key={selectedImage.src}
                    src={selectedImage.src}
                    alt={car.name}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-[620ms] ease-[var(--ease-premium)] group-hover:scale-[1.025] group-active:scale-[1.01]"
                    style={{
                      objectPosition:
                        selectedImage?.objectPosition ?? getVehicleObjectPosition(car.name),
                    }}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.015 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    onError={() => markImageBroken(selectedImage.src)}
                  />
                </AnimatePresence>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-[var(--stone)] text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  Image pending
                </div>
              )}
            </button>

            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {gallery.map((item, index) => {
                  const active = currentImageIndex === index;
                  if (brokenImages.has(item.src)) return null;

                  return (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`View image ${index + 1} of ${gallery.length}`}
                      aria-pressed={active}
                      data-cursor="view"
                      className="group relative h-20 w-32 flex-shrink-0 overflow-hidden bg-[var(--stone)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)]"
                    >
                      <img
                        src={item.src}
                        alt={`${car.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-[420ms] ease-[var(--ease-premium)] group-hover:scale-[1.035]"
                        style={{ objectPosition: item.objectPosition }}
                        onError={() => markImageBroken(item.src)}
                      />
                      <span
                        className={`absolute inset-x-0 bottom-0 h-0.5 transition-colors ${
                          active ? "bg-[var(--oxblood)]" : "bg-transparent"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </MotionDiv>

          <MotionDiv
            className="lg:sticky lg:top-24 lg:self-start"
            variants={fadeUp}
            transition={{ delay: 0.08 }}
          >
            <div className="border-y border-[var(--brass-line)] py-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                {brand} · {categoryLabel}
              </p>
              <h1
                className="mt-4 text-[clamp(2.75rem,5vw,4.8rem)] font-light leading-[0.94] text-[var(--ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {model || car.name}
              </h1>

              <div className="mt-8">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                  Vehicle price
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl font-semibold tabular-nums text-[var(--ink)]">
                    {formatPrice(car.price)}
                  </span>
                  {Number(car.originalPrice) > Number(car.price) && (
                    <span className="text-sm tabular-nums text-[var(--ink-muted)] line-through">
                      {formatPrice(car.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-7 flex items-center gap-2 text-sm text-[var(--ink)]">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isInStock ? "bg-[var(--oxblood)]" : "bg-[var(--ink-muted)]"
                  }`}
                  aria-hidden="true"
                />
                {isInStock ? "Available for reservation" : "Currently unavailable"}
              </div>

              <button
                type="button"
                onClick={handleReserve}
                disabled={!isInStock}
                data-cursor="link"
                className={`group mt-8 inline-flex w-full items-center justify-center gap-4 rounded-[8px] px-6 py-3.5 text-sm font-semibold transition-all duration-[320ms] ease-[var(--ease-premium)] active:scale-[0.985] ${
                  isInStock
                    ? "bg-[var(--oxblood)] text-[var(--surface)] hover:bg-[var(--veloce-oxblood-deep)]"
                    : "bg-[var(--stone)] text-[var(--ink-muted)]"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <MotionSpan
                    key={added ? "added" : "idle"}
                    className="inline-flex items-center gap-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {added ? (
                      <>
                        <Check size={16} />
                        Reservation started
                      </>
                    ) : (
                      <>
                        {isInStock ? "Begin reservation" : "Unavailable"}
                        {isInStock && <VeloceArrow />}
                      </>
                    )}
                  </MotionSpan>
                </AnimatePresence>
              </button>
            </div>
          </MotionDiv>
        </section>

        <MotionSection
          className="mt-[clamp(5rem,9vw,8rem)] max-w-3xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <h2
            className="text-[clamp(2rem,3vw,3rem)] font-light text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            About this vehicle
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[var(--ink-muted)]">
            {story.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          className="mt-[clamp(5rem,9vw,8rem)]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <h2
            className="text-[clamp(2rem,3vw,3rem)] font-light text-[var(--ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Specifications
          </h2>
          <MotionDiv
            className="mt-8 grid border-t border-[var(--brass-line)] md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {specificationRows.map(([label, value, note]) => (
              <MotionDiv
                key={label}
                variants={softReveal}
                className="border-b border-[var(--brass-line)] py-6 md:pr-8 lg:min-h-36"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  {label}
                </p>
                <p className="mt-3 text-lg font-medium leading-7 text-[var(--ink)]">
                  {value}
                </p>
                {note && (
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">{note}</p>
                )}
              </MotionDiv>
            ))}
          </MotionDiv>
        </MotionSection>

        {relatedVehicles.length > 0 && (
          <MotionSection
            className="mt-[clamp(5rem,9vw,8rem)]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <h2
              className="text-[clamp(2rem,3vw,3rem)] font-light text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Similar vehicles
            </h2>

            {relatedVehicles.length === 1 ? (
              <button
                type="button"
                onClick={() => navigate(`/products/${relatedVehicles[0].id}`)}
                data-cursor="view"
                className="group mt-8 grid w-full gap-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)] md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] md:items-end"
              >
                <img
                  src={relatedVehicles[0].imageUrl}
                  alt={relatedVehicles[0].name}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-[520ms] ease-[var(--ease-premium)] group-hover:scale-[1.015]"
                  style={{
                    objectPosition: getVehicleObjectPosition(relatedVehicles[0].name),
                  }}
                />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    {formatCategoryLabel(relatedVehicles[0].category)}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--oxblood)]">
                    {relatedVehicles[0].name}
                  </h3>
                  <p className="mt-3 text-sm font-medium tabular-nums text-[var(--ink)]">
                    {formatPrice(relatedVehicles[0].price)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--oxblood)]">
                    View vehicle
                    <VeloceArrow className="w-7" />
                  </span>
                </div>
              </button>
            ) : (
              <MotionDiv
                className="mt-8 grid grid-cols-1 gap-x-[var(--content-gap)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                {relatedVehicles.map((item) => (
                  <ProductCard key={item.id} product={item} showCategory />
                ))}
              </MotionDiv>
            )}
          </MotionSection>
        )}
      </div>

      <AnimatePresence>
        {viewerOpen && selectedImage && (
          <MotionDiv
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[var(--dark-surface)] px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${car.name} image viewer`}
          >
            <button
              type="button"
              onClick={() => setViewerOpen(false)}
              data-cursor="link"
              aria-label="Close image viewer"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-[8px] text-[var(--surface)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_10%,transparent)]"
            >
              <CloseGlyph />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((index) => (index - 1 + gallery.length) % gallery.length)
                  }
                  data-cursor="link"
                  aria-label="Previous image"
                  className="absolute left-5 top-1/2 hidden -translate-y-1/2 text-[var(--surface)] transition-colors hover:text-[var(--brass)] sm:block"
                >
                  <BackArrow className="h-4 w-12" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((index) => (index + 1) % gallery.length)
                  }
                  data-cursor="link"
                  aria-label="Next image"
                  className="absolute right-5 top-1/2 hidden -translate-y-1/2 text-[var(--surface)] transition-colors hover:text-[var(--brass)] sm:block"
                >
                  <VeloceArrow className="h-4 w-12" />
                </button>
              </>
            )}

            <MotionImg
              key={selectedImage.src}
              src={selectedImage.src}
              alt={car.name}
              className="max-h-[82svh] max-w-[92vw] object-contain"
              style={{ objectPosition: selectedImage.objectPosition }}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--surface)_72%,transparent)]">
              {currentImageIndex + 1} / {gallery.length}
            </p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
}
