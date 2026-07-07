import { createElement, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
import { fadeUp, softReveal, staggerContainer } from "../utils/motionVariants";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionImg = motion.img;
const MotionP = motion.p;
const MotionSection = motion.section;

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
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -28]);
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
      <MotionSection
        ref={heroRef}
        className="relative min-h-[680px] flex items-center overflow-hidden bg-[#f8f3ea]"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <MotionImg
          src="/images/f40.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ y: shouldReduceMotion ? 0 : heroImageY }}
          initial={{ scale: 1.08, opacity: 0.86 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf2]/92 via-[#fffaf2]/66 to-[#17110d]/10" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f8f3ea] to-transparent" />

        <MotionDiv
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          style={{ y: shouldReduceMotion ? 0 : heroTextY }}
          variants={staggerContainer}
        >
          <div className="max-w-3xl">
            <MotionP className="luxury-chip mb-6" variants={fadeUp}>
              Grand Touring Collection
            </MotionP>
            <MotionP
              className="text-[#7a6b5f] text-[11px] tracking-[0.28em] uppercase mb-3"
              variants={fadeUp}
            >
              Private Inventory
            </MotionP>
            <MotionH1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#17110d] leading-[1.02] mb-6"
              variants={fadeUp}
            >
              Curated machines for
              <br />
              <span className="font-normal text-4xl sm:text-5xl lg:text-6xl uppercase">
                extraordinary drives
              </span>
            </MotionH1>
            <MotionP
              className="max-w-2xl text-[#5f5148] text-base sm:text-lg mb-8 leading-8"
              variants={fadeUp}
            >
              Browse verified supercars, sportscars, and luxury vehicles with a
              complete commerce journey from first inspection to order history.
            </MotionP>
            <MotionDiv className="flex flex-wrap gap-4" variants={fadeUp}>
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
            </MotionDiv>
          </div>

          <MotionDiv
            className="mt-14 grid max-w-2xl grid-cols-3 overflow-hidden rounded-[10px] border border-[#d7c5aa] bg-white/58 backdrop-blur shadow-[0_18px_50px_rgba(49,38,24,0.12)]"
            variants={softReveal}
          >
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
          </MotionDiv>
        </MotionDiv>
      </MotionSection>

      <MotionSection
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 section-reveal"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
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

        <MotionDiv
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {mockCategories.map((cat) => (
            <MotionDiv key={cat.id} variants={softReveal}>
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
            </MotionDiv>
          ))}
        </MotionDiv>
      </MotionSection>

      <MotionSection
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 section-reveal"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
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

        <MotionDiv
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </MotionDiv>
      </MotionSection>

      {/* ───── TRUST STRIP ───── */}
      <MotionSection
        className="border-t border-[#d7c5aa] bg-[#fffaf2]/70 section-reveal"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
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
      </MotionSection>
    </div>
  );
}
