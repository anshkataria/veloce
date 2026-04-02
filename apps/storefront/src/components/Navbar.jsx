import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import useCartStore from "../store/cartStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const navigate = useNavigate();

  const navLinks = [
    { to: "/products", label: "All Products" },
    { to: "/products?category=suits", label: "Suits" },
    { to: "/products?category=dupattas", label: "Dupattas" },
    { to: "/products?category=sets", label: "Sets" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-light tracking-[0.3em] uppercase text-gray-900"
          >
            Store
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors ${
                    isActive
                      ? "text-gray-900 font-medium"
                      : "text-gray-500 hover:text-gray-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/products")}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Search size={20} />
            </button>

            <Link
              to="/login"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              <User size={20} />
            </Link>

            <Link
              to="/cart"
              className="relative text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-900"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm tracking-wide ${isActive ? "text-gray-900 font-medium" : "text-gray-500"}`
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
