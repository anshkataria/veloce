import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

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
    { to: "/products?category=luxury", label: "Luxury cars" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl font-semibold tracking-[0.34em] uppercase text-[#17110d]"
          >
            VELOCE
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors pb-1 border-b ${
                    isActive
                      ? "text-[#17110d] font-semibold border-[#b59663]"
                      : "text-[#7a6b5f] hover:text-[#17110d] border-transparent"
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
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#7a6b5f] hover:text-[#17110d] hover:bg-[#eadcc8] transition-colors"
            >
              <Search size={20} />
            </button>

            {user ? (
              <div className="relative group">
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#7a6b5f] hover:text-[#17110d] hover:bg-[#eadcc8] transition-colors">
                  <User size={20} />
                </button>
                <div
                  className="absolute right-0 top-10 w-44 bg-[#fffaf2] border border-[#d7c5aa] rounded-xl shadow-lg
                    opacity-0 group-hover:opacity-100 transition-opacity py-2 z-50"
                >
                  <p className="px-4 py-1 text-xs text-[#7a6b5f] truncate">
                    {user.name}
                  </p>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-[#17110d] hover:bg-[#f1e4d0]"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-[#17110d] hover:bg-[#f1e4d0]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#7a6b5f] hover:text-[#17110d] hover:bg-[#eadcc8] transition-colors"
              >
                <User size={20} />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#7a6b5f] hover:text-[#17110d] hover:bg-[#eadcc8] transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7f1d2d] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#7a6b5f] hover:text-[#17110d] hover:bg-[#eadcc8]"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#d7c5aa] bg-[#fffaf2]/95 backdrop-blur px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm tracking-wide px-2 py-2 rounded-lg ${isActive ? "text-[#17110d] font-semibold bg-[#eadcc8]" : "text-[#7a6b5f] hover:text-[#17110d]"}`
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
