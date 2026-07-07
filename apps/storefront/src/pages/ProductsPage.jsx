import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import { carService } from "../services/carService";
import { getCarImageByName } from "../utils/carImageMap";
import { formatCategoryLabel, getDisplayInStock } from "../utils/catalogUtils";

const CATEGORIES = ["all", "supercars", "sportscars", "luxury"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price Low", value: "price_asc" },
  { label: "Price High", value: "price_desc" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  const activeCategory = searchParams.get("category") || "all";

  const setCategory = (cat) => {
    if (cat === "all") searchParams.delete("category");
    else searchParams.set("category", cat);
    setSearchParams(searchParams);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cars", activeCategory, search, sort],
    queryFn: () =>
      carService
        .getAll({
          category: activeCategory === "all" ? undefined : activeCategory,
          search: search || undefined,
          sort,
          size: 20,
        })
        .then((r) => r.data),
    staleTime: 30000,
  });

  const cars = (data?.content ?? []).map((car) => ({
    ...car,
    imageUrl: getCarImageByName(car.name, car.imageUrl),
    inStock: getDisplayInStock(car.name, car.inStock, car.stock),
  }));
  const totalVehicles = data?.totalElements ?? cars.length;
  const availableVehicles = cars.filter((car) => car.inStock).length;
  const newestVehicles = cars.filter((car) => car.isNew).length;

  return (
    <div className="min-h-screen">
      <section className="border-b border-[#d7c5aa] bg-[#fffaf2]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="luxury-chip mb-4">Curated Inventory</p>
              <h1
                className="text-4xl sm:text-5xl font-light text-[#17110d] leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {activeCategory === "all"
                  ? "Available Vehicles"
                  : formatCategoryLabel(activeCategory)}
              </h1>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-[#5f5148]">
                Browse verified performance and luxury inventory with live
                stock, precise category filters, and an authenticated ordering
                path.
              </p>
            </div>
            <div className="bespoke-frame grid grid-cols-3 overflow-hidden rounded-[2px] bg-white/65 shadow-[0_18px_50px_rgba(49,38,24,0.1)]">
              {[
                { label: "Listed", value: totalVehicles },
                { label: "Ready", value: availableVehicles },
                { label: "New", value: newestVehicles },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`p-4 ${index > 0 ? "border-l border-[#d7c5aa]" : ""}`}
                >
                  <p className="text-xl font-semibold text-[#17110d]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] uppercase text-[#7a6b5f]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Toolbar */}
        <div className="bespoke-frame mb-7 rounded-[2px] bg-[#fffaf2]/90 p-3 shadow-[0_16px_36px_rgba(49,38,24,0.1)]">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a6b5f]"
              />
              <input
                type="text"
                aria-label="Search model or marque"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-[8px] border border-[#d7c5aa] bg-white/75 pl-11 pr-4 text-sm text-[#17110d]
                         focus:outline-none focus:ring-1 focus:ring-[#b59663]"
              />
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-12 rounded-[8px] border border-[#d7c5aa] bg-white/75 px-4 text-sm text-[#17110d]
                       focus:outline-none focus:ring-1 focus:ring-[#b59663] lg:w-44"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d7c5aa] px-4 text-sm text-[#17110d] transition-colors hover:border-[#b59663] sm:hidden"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside
            className={`${filtersOpen ? "block" : "hidden"} lg:block flex-shrink-0`}
          >
            <div className="bespoke-frame sticky top-24 rounded-[2px] bg-[#fffaf2]/90 p-4 shadow-[0_16px_40px_rgba(49,38,24,0.08)]">
              <div className="mb-4 flex items-center gap-2 text-[#17110d]">
                <Sparkles size={15} className="text-[#7f1d2d]" />
                <h3 className="text-xs font-semibold uppercase">Categories</h3>
              </div>
              <div className="grid gap-2">
                {CATEGORIES.map((cat) => {
                  const active = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex items-center justify-between rounded-[8px] border px-3 py-2.5 text-left text-sm transition-colors ${
                        active
                          ? "border-[#17110d] bg-[#17110d] text-white"
                          : "border-[#d7c5aa] text-[#5f5148] hover:border-[#b59663] hover:text-[#17110d] hover:bg-white/65"
                      }`}
                    >
                      <span>
                        {cat === "all" ? "All Cars" : formatCategoryLabel(cat)}
                      </span>
                      {active && <X size={13} />}
                    </button>
                  );
                })}
              </div>
              {activeCategory !== "all" && (
                <button
                  onClick={() => setCategory("all")}
                  className="mt-4 flex items-center gap-1 text-xs text-[#7f1d2d] hover:text-[#17110d]"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>
          </aside>

          {/* Grid */}
          <div className="min-w-0">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-[#fffaf2] border border-[#d7c5aa] rounded-[10px] aspect-[4/5] mb-4" />
                    <div className="h-3 bg-[#eadcc8] rounded w-2/3 mb-3" />
                    <div className="h-3 bg-[#eadcc8] rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="rounded-[10px] border border-[#d7c5aa] bg-[#fffaf2] py-20 text-center">
                <p className="text-sm text-[#7a6b5f]">
                  Failed to load cars. Is the backend running?
                </p>
              </div>
            )}

            {!isLoading && !isError && cars.length === 0 && (
              <div className="rounded-[10px] border border-[#d7c5aa] bg-[#fffaf2] py-20 text-center">
                <p className="text-sm text-[#7a6b5f]">No vehicles found.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="mt-4 rounded-[8px] bg-[#17110d] px-4 py-2 text-sm font-semibold text-white"
                >
                  Clear search
                </button>
              </div>
            )}

            {!isLoading && cars.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {cars.map((car) => (
                  <ProductCard key={car.id} product={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
