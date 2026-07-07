import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import { carService } from "../services/carService";
import { getCarImageByName } from "../utils/carImageMap";
import { getDisplayInStock } from "../utils/catalogUtils";
import { fadeUp, staggerContainer } from "../utils/motionVariants";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const CATEGORY_COPY = {
  all: {
    eyebrow: "The Collection",
    heading: "Available Vehicles",
    supporting: "Explore the current selection.",
  },
  supercars: {
    heading: "Supercars",
    supporting: "The current selection.",
  },
  sportscars: {
    heading: "Sportscars",
    supporting: "The current selection.",
  },
  luxury: {
    heading: "Luxury Cars",
    supporting: "The current selection.",
  },
};

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

function SearchGlyph({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 ${className}`}
    >
      <circle cx="10.2" cy="10.2" r="5.3" stroke="currentColor" strokeWidth="1.45" />
      <path
        d="M14.4 14.4L18.7 18.7"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  const activeCategory = searchParams.get("category") || "all";
  const pageCopy = CATEGORY_COPY[activeCategory] ?? CATEGORY_COPY.all;

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["cars", activeCategory, search, sort],
    queryFn: () =>
      carService
        .getAll({
          category: activeCategory === "all" ? undefined : activeCategory,
          search: search || undefined,
          sort,
          size: 24,
        })
        .then((r) => r.data),
    staleTime: 30000,
  });

  const cars = (data?.content ?? []).map((car) => ({
    ...car,
    imageUrl: getCarImageByName(car.name, car.imageUrl),
    inStock: getDisplayInStock(car.name, car.inStock, car.stock),
  }));

  const hasSearch = search.trim().length > 0;

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[var(--canvas)]">
      <MotionSection
        className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] pb-8 pt-[clamp(4.5rem,8vw,7rem)]"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {pageCopy.eyebrow && (
          <p className="mb-4 text-[11px] uppercase tracking-[0.26em] text-[var(--ink-muted)]">
            {pageCopy.eyebrow}
          </p>
        )}
        <h1
          className="text-[clamp(2.75rem,5vw,4.75rem)] font-light leading-[0.98] text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pageCopy.heading}
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-[var(--ink-muted)]">
          {pageCopy.supporting}
        </p>
      </MotionSection>

      <section className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] pb-[var(--section-space-medium)]">
        <MotionDiv
          className="mb-9 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.06 }}
        >
          <label className="relative w-full md:max-w-[34rem]">
            <span className="sr-only">Search inventory</span>
            <SearchGlyph className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              type="search"
              aria-label="Search inventory"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by marque or model"
              data-cursor="search"
              className="h-11 w-full rounded-[8px] border border-[var(--brass-line-strong)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] pl-11 pr-4 text-sm text-[var(--ink)] outline-none transition-colors duration-[260ms] ease-[var(--ease-premium)] placeholder:text-[color-mix(in_srgb,var(--ink-muted)_76%,transparent)] focus:border-[var(--oxblood)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--oxblood)_16%,transparent)]"
            />
          </label>

          <label className="relative w-full md:w-56">
            <span className="sr-only">Sort vehicles</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort vehicles"
              data-cursor="link"
              className="h-11 w-full appearance-none rounded-[8px] border border-[var(--brass-line-strong)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] px-4 pr-10 text-sm text-[var(--ink)] outline-none transition-colors duration-[260ms] ease-[var(--ease-premium)] focus:border-[var(--oxblood)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--oxblood)_16%,transparent)]"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-1.5 w-1.5 -translate-y-2 rotate-45 border-b border-r border-[var(--ink)]"
            />
          </label>
        </MotionDiv>

        {isLoading && (
          <div className="grid grid-cols-1 gap-x-[var(--content-gap)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] bg-[var(--stone)]" />
                <div className="mt-4 h-2.5 w-20 rounded bg-[var(--brass-line-strong)]" />
                <div className="mt-3 h-5 w-2/3 rounded bg-[var(--brass-line-strong)]" />
                <div className="mt-3 h-3 w-28 rounded bg-[var(--stone)]" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="border-y border-[var(--brass-line)] py-16">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Inventory is unavailable.
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--ink-muted)]">
              Vehicle data could not be loaded. Check the service connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              data-cursor="link"
              className="mt-6 rounded-[8px] border border-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--oxblood)] hover:bg-[var(--oxblood)] hover:text-[var(--surface)] disabled:border-[var(--brass-line)] disabled:text-[var(--ink-muted)]"
            >
              {isFetching ? "Retrying..." : "Retry"}
            </button>
          </div>
        )}

        {!isLoading && !isError && cars.length === 0 && (
          <div className="border-y border-[var(--brass-line)] py-16">
            <p className="text-sm font-semibold text-[var(--ink)]">
              {hasSearch
                ? "No vehicles match this search."
                : "No vehicles are available yet."}
            </p>
            {hasSearch && (
              <button
                type="button"
                onClick={() => setSearch("")}
                data-cursor="link"
                className="mt-4 text-sm font-semibold text-[var(--oxblood)] transition-colors hover:text-[var(--ink)]"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && cars.length > 0 && (
          <MotionDiv
            key={`${activeCategory}-${sort}-${search}`}
            className="grid grid-cols-1 gap-x-[var(--content-gap)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {cars.map((car) => (
              <ProductCard
                key={car.id}
                product={car}
                showCategory={activeCategory === "all"}
              />
            ))}
          </MotionDiv>
        )}
      </section>
    </div>
  );
}
