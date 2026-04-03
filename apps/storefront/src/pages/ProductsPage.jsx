import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { mockProducts } from "../data/mockProducts";

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

  // read category from URL — ?category=suits
  const activeCategory = searchParams.get("category") || "all";

  const setCategory = (cat) => {
    if (cat === "all") searchParams.delete("category");
    else searchParams.set("category", cat);
    setSearchParams(searchParams);
  };

  const filtered = useMemo(() => {
    let result = [...mockProducts];

    if (activeCategory !== "all")
      result = result.filter((p) => p.category === activeCategory);

    if (search.trim())
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );

    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [activeCategory, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 tracking-wide">
          {activeCategory === "all"
            ? "All Products"
            : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{filtered.length} products</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm
                     focus:outline-none focus:ring-1 focus:ring-gray-400"
        />

        {/* Sort */}
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

        {/* Filter toggle (mobile) */}
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="sm:hidden flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* ── SIDEBAR FILTERS (desktop always visible, mobile toggled) ── */}
        <aside
          className={`${filtersOpen ? "block" : "hidden"} sm:block w-48 flex-shrink-0`}
        >
          <div className="sticky top-24 space-y-6">
            {/* Category filter */}
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
                      {cat === "all" ? "All Products" : cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* In stock filter */}
            <div>
              <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-3">
                Availability
              </h3>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded" />
                In Stock Only
              </label>
            </div>

            {/* Clear filters */}
            {activeCategory !== "all" && (
              <button
                onClick={() => setCategory("all")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-sm">No products found.</p>
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
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
