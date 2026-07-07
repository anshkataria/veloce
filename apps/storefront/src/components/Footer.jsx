import { createElement } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe2, ShieldCheck, Sparkles } from "lucide-react";

const footerLinks = [
  { label: "All Inventory", to: "/products" },
  { label: "Supercars", to: "/products?category=supercars" },
  { label: "Sportscars", to: "/products?category=sportscars" },
  { label: "Luxury Cars", to: "/products?category=luxury" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#d7c5aa] bg-[#17110d] text-[#fffaf2]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.32em] text-[#b59663]">
              Private Motor Atelier
            </p>
            <h2
              className="text-5xl font-semibold tracking-[0.2em] sm:text-7xl lg:text-8xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VELOCE
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#d7c5aa]">
              A curated commerce experience for exceptional machines: verified
              stock, private-client handoff, and a purchase flow built around
              confidence rather than impulse.
            </p>
          </div>

          <div className="bespoke-frame rounded-[2px] border-[#b59663]/45 bg-white/[0.04] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-[#fffaf2] p-2 text-[#17110d]">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Private Desk</p>
                <p className="text-xs text-[#d7c5aa]">
                  Reserved for serious enquiries
                </p>
              </div>
            </div>
            <Link
              to="/products"
              className="inline-flex w-full items-center justify-between rounded-[10px] bg-[#fffaf2] px-4 py-3 text-sm font-semibold text-[#17110d] transition-transform hover:-translate-y-0.5"
            >
              View Current Inventory
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-y border-[#b59663]/30 py-6 sm:grid-cols-3">
          {[
            [ShieldCheck, "Verified inventory"],
            [Globe2, "International handoff support"],
            [Sparkles, "Authenticated order history"],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              {createElement(icon, {
                size: 18,
                className: "text-[#b59663]",
              })}
              <span className="text-[#efe2ce]">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#d7c5aa]">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-[#fffaf2]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs uppercase tracking-[0.24em] text-[#b59663]">
            © {new Date().getFullYear()} VELOCE
          </p>
        </div>
      </div>
    </footer>
  );
}
