import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import VeloceArrow from "./VeloceArrow";
import { formatPrice } from "../utils/formatPrice";
import { formatCategoryLabel } from "../utils/catalogUtils";
import { softReveal } from "../utils/motionVariants";

const MotionDiv = motion.div;
const MotionImg = motion.img;

function splitVehicleName(product) {
  const brand = product.brand || product.name?.split(" ")[0] || "Vehicle";
  const model = product.name?.startsWith(brand)
    ? product.name.slice(brand.length).trim()
    : product.name;

  return { brand, model: model || product.name };
}

function getObjectPosition(name = "") {
  const key = name.toLowerCase();

  if (key.includes("mclaren")) return "52% 50%";
  if (key.includes("aston")) return "46% 50%";
  if (key.includes("rolls")) return "52% 50%";
  if (key.includes("bmw")) return "50% 48%";
  if (key.includes("ferrari")) return "48% 50%";
  if (key.includes("porsche")) return "50% 50%";
  if (key.includes("mercedes")) return "54% 50%";
  if (key.includes("lamborghini")) return "50% 50%";

  return "50% 50%";
}

export default function ProductCard({ product, showCategory = false }) {
  const imageSrc = product.images?.[0] ?? product.imageUrl;
  const { brand, model } = splitVehicleName(product);
  const isInStock =
    typeof product.inStock === "boolean"
      ? product.inStock
      : Number(product.stock ?? 0) > 0;

  return (
    <MotionDiv
      variants={softReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <Link
        to={`/products/${product.id}`}
        data-cursor="view"
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--oxblood)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--stone)]">
          {imageSrc ? (
            <MotionImg
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-[560ms] ease-[var(--ease-premium)] group-hover:scale-[1.035] group-active:scale-[1.012]"
              style={{ objectPosition: getObjectPosition(product.name) }}
              initial={{ scale: 1.025 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[var(--stone)] text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              Image pending
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--dark-surface)_26%,transparent)] via-transparent to-transparent opacity-55 transition-opacity duration-[520ms] ease-[var(--ease-premium)] group-hover:opacity-68" />
        </div>

        <div className="mt-4 grid min-h-[8.25rem] content-start gap-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              {brand}
            </p>
            {showCategory && (
              <p className="text-[11px] text-[var(--ink-muted)]">
                {formatCategoryLabel(product.category)}
              </p>
            )}
          </div>

          <div className="flex min-h-[3.15rem] items-start justify-between gap-4">
            <h3 className="min-w-0 text-lg font-medium leading-snug text-[var(--ink)] transition-colors duration-[320ms] ease-[var(--ease-premium)] group-hover:text-[var(--oxblood)]">
              {model}
            </h3>
            <VeloceArrow className="mt-1 flex-shrink-0 text-[var(--oxblood)] opacity-0 transition-opacity duration-[320ms] ease-[var(--ease-premium)] group-hover:opacity-100" />
          </div>

          <p className="text-sm font-medium tabular-nums text-[var(--ink)]">
            {formatPrice(product.price)}
          </p>

          {!isInStock && (
            <p className="text-xs font-medium text-[var(--oxblood)]">
              Unavailable
            </p>
          )}
        </div>
      </Link>
    </MotionDiv>
  );
}
