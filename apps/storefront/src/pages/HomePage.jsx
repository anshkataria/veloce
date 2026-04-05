import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  RefreshCw,
  Shield,
  HeadphonesIcon,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { carService } from "../services/carService";
import { mockCategories } from "../data/mockProducts";
import { getCarImageByName } from "../utils/carImageMap";
import { getDisplayInStock } from "../utils/catalogUtils";

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

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative h-[90vh] min-h-[560px] flex items-center overflow-hidden bg-stone-100">
        <img
          src="/images/f40.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/35" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="luxury-chip mb-5">Grand Touring Collection</p>
            <p className="text-white/80 text-[11px] tracking-[0.28em] uppercase mb-3">
              New Arrivals
            </p>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-6"
            >
              Engineered for
              <br />
              <span className="font-normal tracking-[0.12em] text-4xl sm:text-5xl lg:text-6xl uppercase">
                EXTRAORDINARY
              </span>
            </h1>
            <p className="text-white/75 text-base sm:text-lg mb-8 leading-relaxed">
              Handpicked Supercars, Sportscars and Luxury cars. Delivered to
              your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="luxury-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 section-reveal"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-light text-[#f2f4f3] tracking-[0.08em] uppercase">
            Shop by Category
          </h2>
          <Link
            to="/products"
            className="text-sm text-[#a9927d] hover:text-[#f2f4f3] flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] soft-card"
            >
              <img
                src={categoryImages[cat.slug] ?? cat.image}
                alt={cat.name}
                className="w-full h-full object-cover grayscale-[18%] contrast-110 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white text-lg font-medium tracking-wide">
                  {cat.name}
                </p>
                <p className="text-white/70 text-[11px] tracking-[0.14em] uppercase">
                  {cat.count} styles
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-light text-[#f2f4f3] tracking-[0.08em] uppercase">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-sm text-[#a9927d] hover:text-[#f2f4f3] flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ───── TRUST STRIP ───── */}
      <section
        className="border-t border-[#5e503f] bg-[#0a0908] section-reveal"
        style={{ animationDelay: "320ms" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Worldwide Delivery",
                desc: "White-glove global transport service",
              },
              {
                icon: RefreshCw,
                title: "7-Day Returns",
                desc: "Hassle-free return policy",
              },
              {
                icon: Shield,
                title: "Verified Inventory",
                desc: "Every car inspected & certified",
              },
              {
                icon: HeadphonesIcon,
                title: "Concierge Support",
                desc: "Dedicated advisor, 24/7 worldwide",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-2xl border border-[#5e503f] bg-[#f2f4f3]/5 p-4"
              >
                <div className="p-2 bg-[#49111c]/40 border border-[#a9927d]/40 rounded-lg shadow-sm flex-shrink-0">
                  <Icon size={18} className="text-[#f2f4f3]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f2f4f3]">{title}</p>
                  <p className="text-xs text-[#d8d0c7] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
