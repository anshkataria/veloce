import { createElement } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  RefreshCw,
  Shield,
  HeadphonesIcon,
  Gauge,
  Globe2,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { carService } from "../services/carService";
import { mockCategories } from "../data/mockProducts";
import { getCarImageByName } from "../utils/carImageMap";
import { getDisplayInStock } from "../utils/catalogUtils";

const trustItems = [
  {
    icon: Globe2,
    title: "Worldwide Delivery",
    desc: "Enclosed transport coordination for every handoff",
  },
  {
    icon: RefreshCw,
    title: "7-Day Returns",
    desc: "Review window for private-client confidence",
  },
  {
    icon: Shield,
    title: "Verified Inventory",
    desc: "Vehicle data, stock state, and pricing kept aligned",
  },
  {
    icon: HeadphonesIcon,
    title: "Concierge Support",
    desc: "A direct path from interest to reservation",
  },
];

export default function HomePage() {
  const categoryImages = {
    supercars: "/images/category-supercars.jpg",
    sportscars: "/images/category-sportscars.jpg",
    luxury: "/images/category-luxury.jpg",
  };

  const { data } = useQuery({
    queryKey: ["cars", "featured"],
    queryFn: () =>
      carService.getAll({ size: 4, sort: "newest" }).then((r) => r.data),
  });
  const featuredProducts = (data?.content ?? []).map((car) => {
    const imageUrl = getCarImageByName(car.name, car.imageUrl);
    return {
      ...car,
      imageUrl,
      images: [imageUrl],
      sizes: car.variants?.split(",") ?? [],
      inStock: getDisplayInStock(car.name, car.inStock, car.stock),
    };
  });
  const heroStats = [
    { label: "Verified cars", value: "32+" },
    { label: "Avg. handoff", value: "72h" },
    { label: "Markets served", value: "14" },
  ];

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden bg-[#f8f3ea]">
        <img
          src="/images/f40.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf2]/92 via-[#fffaf2]/66 to-[#17110d]/10" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f8f3ea] to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="luxury-chip mb-6">Grand Touring Collection</p>
            <p className="text-[#7a6b5f] text-[11px] tracking-[0.28em] uppercase mb-3">
              Private Inventory
            </p>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#17110d] leading-[1.02] mb-6"
            >
              Curated machines for
              <br />
              <span className="font-normal text-4xl sm:text-5xl lg:text-6xl uppercase">
                extraordinary drives
              </span>
            </h1>
            <p className="max-w-2xl text-[#5f5148] text-base sm:text-lg mb-8 leading-8">
              Browse verified supercars, sportscars, and luxury vehicles with a
              complete commerce journey from first inspection to order history.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="luxury-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-[8px]"
              >
                Explore Inventory <ArrowRight size={16} />
              </Link>
              <Link
                to="/products?category=supercars"
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#d7c5aa] bg-white/45 px-6 py-3 text-sm font-semibold text-[#17110d] transition-colors hover:border-[#b59663] hover:bg-[#fffaf2]"
              >
                View Supercars <Gauge size={16} />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-3 overflow-hidden rounded-[10px] border border-[#d7c5aa] bg-white/58 backdrop-blur shadow-[0_18px_50px_rgba(49,38,24,0.12)]">
            {heroStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`p-4 sm:p-5 ${index > 0 ? "border-l border-[#d7c5aa]" : ""}`}
              >
                <p className="text-xl sm:text-2xl font-semibold text-[#17110d]">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] uppercase text-[#7a6b5f]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 section-reveal"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-[11px] uppercase text-[#7a6b5f] mb-2">
              Choose your lane
            </p>
            <h2 className="text-3xl font-light text-[#17110d]">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm text-[#7f1d2d] hover:text-[#17110d] flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bespoke-frame relative overflow-hidden rounded-[2px] aspect-[3/4] bg-[#fffaf2] hover-lift"
            >
              <img
                src={categoryImages[cat.slug] ?? cat.image}
                alt={cat.name}
                className="w-full h-full object-cover grayscale-[18%] contrast-110 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17110d]/82 via-[#17110d]/12 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white text-lg font-medium tracking-wide">
                  {cat.name}
                </p>
                <p className="mt-1 text-white/72 text-[11px] tracking-[0.14em] uppercase">
                  {cat.count} curated listings
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 section-reveal"
        style={{ animationDelay: "220ms" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-[11px] uppercase text-[#7a6b5f] mb-2">
              Live API inventory
            </p>
            <h2 className="text-3xl font-light text-[#17110d]">
              Featured Vehicles
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm text-[#7f1d2d] hover:text-[#17110d] flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ───── TRUST STRIP ───── */}
      <section
        className="border-t border-[#d7c5aa] bg-[#fffaf2]/70 section-reveal"
        style={{ animationDelay: "320ms" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bespoke-frame flex items-start gap-3 rounded-[2px] bg-white/60 p-5 hover-lift"
              >
                <div className="p-2 bg-[#f1e4d0] border border-[#d7c5aa] rounded-lg shadow-sm flex-shrink-0">
                  {createElement(icon, {
                    size: 18,
                    className: "text-[#7f1d2d]",
                  })}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#17110d]">{title}</p>
                  <p className="text-xs text-[#7a6b5f] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
