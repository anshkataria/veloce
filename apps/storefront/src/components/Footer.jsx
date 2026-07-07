import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Inventory", to: "/products" },
  { label: "Account", to: "/login" },
  { label: "Cart", to: "/cart" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--brass-line)] bg-[var(--dark-surface)] text-[var(--surface)]">
      <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)] py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              to="/"
              className="text-2xl font-semibold tracking-[0.3em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VELOCE
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[color-mix(in_srgb,var(--surface)_70%,var(--brass))]">
              A quiet marketplace for considered performance and luxury
              vehicles.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[color-mix(in_srgb,var(--surface)_70%,var(--brass))]">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors duration-200 hover:text-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-7 border-t border-[var(--brass-line)] pt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--brass)]">
            © {new Date().getFullYear()} VELOCE
          </p>
        </div>
      </div>
    </footer>
  );
}
