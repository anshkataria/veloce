import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { carService } from "../services/carService";
import { mockCategories } from "../data/mockProducts";
import { getCarImageByName } from "../utils/carImageMap";
import { getDisplayInStock } from "../utils/catalogUtils";
import { formatPrice } from "../utils/formatPrice";
import { fadeUp, softReveal, staggerContainer } from "../utils/motionVariants";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionImg = motion.img;
const MotionP = motion.p;
const MotionSection = motion.section;

const categoryImages = {
  supercars: "/images/category-supercars.jpg",
  sportscars: "/images/category-sportscars.jpg",
  luxury: "/images/category-luxury.jpg",
};

function splitVehicleName(product) {
  const brand = product.brand || product.name?.split(" ")[0] || "Vehicle";
  const model = product.name?.startsWith(brand)
    ? product.name.slice(brand.length).trim()
    : product.name;

  return { brand, model: model || product.name };
}

function VeloceArrow({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 34 12"
      fill="none"
      className={`h-3 w-8 transition-transform duration-[360ms] ease-[var(--ease-premium)] group-hover:translate-x-1.5 ${className}`}
    >
      <path
        d="M1 6H31"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M26.5 1.5L31 6L26.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VehicleCard({ product }) {
  const imageSrc = product.images?.[0] ?? product.imageUrl;
  const { brand, model } = splitVehicleName(product);
  const isInStock =
    typeof product.inStock === "boolean"
      ? product.inStock
      : Number(product.stock ?? 0) > 0;
  const hasOriginalPrice =
    Number(product.originalPrice) > Number(product.price);

  return (
    <MotionDiv variants={softReveal}>
      <Link
        to={`/products/${product.id}`}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)]"
        data-cursor="view"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--stone)]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-[560ms] ease-[var(--ease-premium)] group-hover:scale-[1.035] group-active:scale-[1.015]"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--dark-surface)_36%,transparent)] via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-46" />
          {!isInStock && (
            <div className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--surface)_82%,transparent)]">
              Unavailable
            </div>
          )}
        </div>

        <div className="mt-4 grid min-h-[7.5rem] content-start gap-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            {brand}
          </p>
          <div className="flex items-start justify-between gap-4">
            <h3 className="min-w-0 text-lg font-medium leading-snug text-[var(--ink)] transition-transform duration-[360ms] ease-[var(--ease-premium)] group-hover:-translate-y-0.5">
              {model}
            </h3>
            <VeloceArrow className="mt-1 flex-shrink-0 text-[var(--oxblood)] opacity-0 group-hover:opacity-100" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-medium tabular-nums text-[var(--ink)]">
              {formatPrice(product.price)}
            </span>
            {hasOriginalPrice && (
              <span className="text-xs text-[var(--ink-muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}

function VehicleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-[var(--stone)]" />
      <div className="mt-4 h-2.5 w-20 rounded bg-[var(--brass-line-strong)]" />
      <div className="mt-3 h-4 w-2/3 rounded bg-[var(--brass-line-strong)]" />
      <div className="mt-3 h-3 w-28 rounded bg-[var(--stone)]" />
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.025]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.72], [0, -34]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.68], [1, 0.78]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["cars", "homepage-featured"],
    queryFn: () =>
      carService.getAll({ size: 4, sort: "newest" }).then((r) => r.data),
    staleTime: 30000,
  });

  const featuredProducts = (data?.content ?? []).map((car) => {
    const imageUrl = getCarImageByName(car.name, car.imageUrl);
    return {
      ...car,
      imageUrl,
      images: imageUrl ? [imageUrl] : [],
      sizes: car.variants?.split(",") ?? [],
      inStock: getDisplayInStock(car.name, car.inStock, car.stock),
    };
  });

  return (
    <div className="overflow-hidden bg-[var(--canvas)]">
      <MotionSection
        ref={heroRef}
        className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <MotionImg
          src="/images/f40.jpg"
          alt="Ferrari F40 photographed in a warm studio setting"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{
            y: shouldReduceMotion ? 0 : heroImageY,
            scale: shouldReduceMotion ? 1 : heroImageScale,
          }}
          initial={{ opacity: 0.96 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgba(243,239,231,0.92)_0%,rgba(243,239,231,0.7)_34%,rgba(243,239,231,0.08)_78%,rgba(243,239,231,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--canvas)] to-transparent" />

        <MotionDiv
          className="relative z-10 mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-[var(--page-max-width)] items-center px-[var(--page-gutter)] py-16"
          style={{
            y: shouldReduceMotion ? 0 : heroTextY,
            opacity: shouldReduceMotion ? 1 : heroTextOpacity,
          }}
          variants={staggerContainer}
        >
          <div className="max-w-[38rem]">
            <MotionP
              className="mb-5 text-[11px] uppercase tracking-[0.28em] text-[var(--ink-muted)]"
              variants={fadeUp}
            >
              Private automotive gallery
            </MotionP>
            <MotionH1
              className="max-w-[10ch] text-[clamp(3.6rem,6.35vw,5.35rem)] font-light leading-[0.92] text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
              variants={fadeUp}
            >
              Machines worth remembering.
            </MotionH1>
            <MotionP
              className="mt-7 max-w-md text-base leading-7 text-[var(--ink-muted)] sm:text-lg"
              variants={fadeUp}
            >
              A focused selection of performance and luxury cars.
            </MotionP>
            <MotionDiv className="mt-9" variants={fadeUp}>
              <Link
                to="/products"
                data-cursor="explore"
                className="group inline-flex items-center gap-4 rounded-[8px] border border-[color-mix(in_srgb,var(--ink)_35%,transparent)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] backdrop-blur-sm transition-all duration-[340ms] ease-[var(--ease-premium)] hover:border-[var(--oxblood)] hover:bg-[var(--oxblood)] hover:text-[var(--surface)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)]"
              >
                Explore Inventory
                <VeloceArrow />
              </Link>
            </MotionDiv>
          </div>
        </MotionDiv>
      </MotionSection>

      <MotionSection
        className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-[var(--section-space-large)]"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              Current selection
            </p>
            <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-light text-[var(--ink)]">
              Featured Vehicles
            </h2>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--oxblood)] transition-colors hover:text-[var(--ink)]"
            data-cursor="link"
          >
            View all
            <VeloceArrow className="w-7" />
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-x-[var(--content-gap)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <VehicleSkeleton key={index} />
            ))}
          </div>
        )}

        {isError && (
          <div className="border-y border-[var(--brass-line)] py-14">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Inventory is unavailable.
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--ink-muted)]">
              Vehicle data could not be loaded. Check the service connection
              and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-6 rounded-[8px] border border-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--surface)] disabled:cursor-not-allowed disabled:border-[var(--brass-line)] disabled:text-[var(--ink-muted)]"
            >
              {isFetching ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}

        {!isLoading && !isError && featuredProducts.length === 0 && (
          <div className="border-y border-[var(--brass-line)] py-14">
            <p className="text-sm font-semibold text-[var(--ink)]">
              No vehicles are available yet.
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
              Add vehicles through the inventory system to populate this
              section.
            </p>
          </div>
        )}

        {!isLoading && !isError && featuredProducts.length > 0 && (
          <MotionDiv
            className="grid grid-cols-1 gap-x-[var(--content-gap)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {featuredProducts.map((product) => (
              <VehicleCard
                key={product.id}
                product={product}
              />
            ))}
          </MotionDiv>
        )}
      </MotionSection>

      <MotionSection
        className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] pb-[var(--section-space-medium)] pt-4"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        <div className="mb-9">
          <h2 className="text-[clamp(2rem,3.2vw,2.85rem)] font-light text-[var(--ink)]">
            Browse the collection
          </h2>
        </div>

        <MotionDiv
          className="grid gap-[var(--content-gap)] md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {mockCategories.map((cat) => (
            <MotionDiv
              key={cat.id}
              variants={softReveal}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)]"
                data-cursor="explore"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--stone)] active:[&>img]:scale-[1.012]">
                  <img
                    src={categoryImages[cat.slug] ?? cat.image}
                    alt={`${cat.name} category`}
                    className="h-full w-full object-cover transition-transform duration-[620ms] ease-[var(--ease-premium)] group-hover:scale-[1.035]"
                    style={{
                      objectPosition:
                        cat.slug === "supercars"
                          ? "48% 50%"
                          : cat.slug === "sportscars"
                            ? "54% 48%"
                            : "50% 50%",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--ink)_65%,transparent)] via-[color-mix(in_srgb,var(--ink)_10%,transparent)] to-transparent transition-opacity duration-[620ms] ease-[var(--ease-premium)] group-hover:opacity-90" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 transition-transform duration-[560ms] ease-[var(--ease-premium)] group-hover:-translate-y-0.5">
                    <p className="text-[clamp(1.1rem,1.5vw,1.35rem)] font-medium text-[var(--surface)]">
                      {cat.name}
                    </p>
                    <VeloceArrow className="mb-1 text-[var(--surface)] opacity-75" />
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </MotionSection>
    </div>
  );
}
