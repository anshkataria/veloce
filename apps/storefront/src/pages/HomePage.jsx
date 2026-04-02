import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  RefreshCw,
  Shield,
  HeadphonesIcon,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { mockProducts, mockCategories } from "../data/mockProducts";

export default function HomePage() {
  const featuredProducts = mockProducts.filter((p) => p.inStock).slice(0, 4);

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center overflow-hidden bg-stone-100">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-4">
              New Collection
            </p>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-6 italic"
            >
              Wear the Art of
              <br />
              <span className="not-italic font-normal tracking-widest text-4xl sm:text-5xl lg:text-6xl">
                INDIAN CRAFT
              </span>
            </h1>
            <p className="text-white/75 text-base sm:text-lg mb-8 leading-relaxed">
              Handcrafted ethnic wear that blends tradition with modern
              silhouettes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3
                           text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                to="/products?category=suits"
                className="inline-flex items-center gap-2 border border-white text-white px-6 py-3
                           text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
              >
                View Suits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-light text-gray-900 tracking-wide">
            Shop by Category
          </h2>
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white text-lg font-medium">{cat.name}</p>
                <p className="text-white/70 text-sm">{cat.count} styles</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── FEATURED PRODUCTS ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-light text-gray-900 tracking-wide">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
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
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "On orders above ₹999",
              },
              {
                icon: RefreshCw,
                title: "Easy Returns",
                desc: "7-day hassle-free returns",
              },
              {
                icon: Shield,
                title: "Secure Payments",
                desc: "100% safe & encrypted",
              },
              {
                icon: HeadphonesIcon,
                title: "Support",
                desc: "Mon–Sat, 10am–6pm",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                  <Icon size={18} className="text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
