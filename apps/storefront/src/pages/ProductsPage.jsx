import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import { carService } from "../services/carService";

const CATEGORIES = ["all", "supercars", "sportscars", "luxury"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
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

  const cars = data?.content ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-light text-gray-900 tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {activeCategory === "all"
            ? "All Cars"
            : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{cars.length} vehicles</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm
                     focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm
                     focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="sm:hidden flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside
          className={`${filtersOpen ? "block" : "hidden"} sm:block w-48 flex-shrink-0`}
        >
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-3">
                Category
              </h3>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat)}
                      className={`text-sm capitalize transition-colors ${
                        activeCategory === cat
                          ? "text-gray-900 font-medium"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {cat === "all" ? "All Cars" : cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {activeCategory !== "all" && (
              <button
                onClick={() => setCategory("all")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {isLoading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 rounded-xl aspect-[3/4] mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-24">
              <p className="text-gray-400 text-sm">
                Failed to load cars. Is the backend running?
              </p>
            </div>
          )}

          {!isLoading && !isError && cars.length === 0 && (
            <div className="text-center py-24">
              <p className="text-gray-400 text-sm">No cars found.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-4 text-sm text-gray-900 underline"
              >
                Clear search
              </button>
            </div>
          )}

          {!isLoading && cars.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {cars.map((car) => (
                <ProductCard key={car.id} product={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
