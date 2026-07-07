import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

function SearchGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle
        cx="10.3"
        cy="10.3"
        r="5.6"
        stroke="currentColor"
        strokeWidth="1.5"
        className="origin-center transition-transform duration-[280ms] ease-[var(--ease-premium)] group-hover:scale-[1.04]"
      />
      <path
        d="M14.7 14.7L19 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="transition-transform duration-[280ms] ease-[var(--ease-premium)] group-hover:translate-x-0.5 group-hover:translate-y-0.5"
      />
    </svg>
  );
}

function AccountGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8.2" r="3.1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.2 19.2C7.25 15.9 9.2 14.25 12 14.25C14.8 14.25 16.75 15.9 17.8 19.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5 transition-transform duration-[220ms] ease-[var(--ease-premium)] group-hover:-translate-y-0.5 group-active:scale-[0.94]"
    >
      <path
        d="M7.4 9.2H16.6L17.25 19H6.75L7.4 9.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.2V8.1C9.2 6.55 10.45 5.3 12 5.3C13.55 5.3 14.8 6.55 14.8 8.1V9.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 8H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 16H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M7 7L17 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 7L7 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const iconButtonClass =
  "group flex h-10 w-10 items-center justify-center rounded-[8px] text-[var(--ink)] transition-all duration-[260ms] ease-[var(--ease-premium)] hover:bg-[color-mix(in_srgb,var(--surface)_58%,transparent)] hover:text-[var(--oxblood)] active:scale-[0.95]";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/products", label: "All Cars" },
    { to: "/products?category=supercars", label: "Supercars" },
    { to: "/products?category=sportscars", label: "Sportscars" },
    { to: "/products?category=luxury", label: "Luxury Cars" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="mx-auto max-w-[var(--page-max-width)] px-[var(--page-gutter)]">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[1.35rem] font-semibold tracking-[0.32em] uppercase text-[var(--ink)]"
          >
            VELOCE
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `border-b pb-1 text-sm tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--ink)] font-semibold border-[var(--oxblood)]"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)] border-transparent"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Search inventory"
              onClick={() => navigate("/products")}
              className={iconButtonClass}
            >
              <SearchGlyph />
            </button>

            {user ? (
              <div className="relative group">
                <button
                  aria-label="Account menu"
                  className={iconButtonClass}
                >
                  <AccountGlyph />
                </button>
                <div
                  className="absolute right-0 top-10 w-44 bg-[var(--surface)] border border-[var(--brass-line)] rounded-xl shadow-lg
                    opacity-0 group-hover:opacity-100 transition-opacity py-2 z-50"
                >
                  <p className="px-4 py-1 text-xs text-[var(--ink-muted)] truncate">
                    {user.name}
                  </p>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--stone)]"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--stone)]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Sign in"
                className={iconButtonClass}
              >
                <AccountGlyph />
              </Link>
            )}

            <Link
              to="/cart"
              aria-label={`Cart with ${totalItems} item${totalItems === 1 ? "" : "s"}`}
              className={`relative ${iconButtonClass}`}
            >
              <BagGlyph />
              {totalItems > 0 && (
                <span
                  key={totalItems}
                  className="cart-badge-pop absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--oxblood)] px-1 text-[9px] leading-none text-[var(--surface)]"
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              aria-label="Toggle navigation menu"
              className={`${iconButtonClass} md:hidden`}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <CloseGlyph /> : <MenuGlyph />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--brass-line)] bg-[var(--surface)]/95 backdrop-blur px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm tracking-wide px-2 py-2 rounded-lg ${isActive ? "text-[var(--ink)] font-semibold bg-[var(--stone)]" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
