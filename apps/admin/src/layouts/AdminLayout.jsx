import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { createElement, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Store,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/orders", icon: ShoppingBag, label: "Orders" },
];

export default function AdminLayout() {
  const [mobileOpen, setMobile] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[var(--canvas)] text-[var(--ink)] font-body selection:bg-[var(--brass)] selection:text-[var(--ink)]">
      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[var(--surface)] border-r border-[var(--veloce-border)] transition-transform duration-300 ease-[var(--ease-premium)] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-[var(--veloce-border)] px-6 py-[22px]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--stone)]">
              <Store size={18} className="text-[var(--oxblood)]" />
            </div>
            <div>
              <span className="font-display text-sm font-bold tracking-[0.2em] text-[var(--ink)] uppercase">
                VELOCE
              </span>
              <p className="mt-0.5 text-[9px] font-medium tracking-[0.15em] text-[var(--ink-muted)] uppercase">
                Operations
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobile(false)}
            className="lg:hidden text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4">
          <p className="px-3 pb-3 pt-2 text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
            Menu
          </p>
          <div className="flex flex-col gap-1">
            {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition-all duration-[240ms] ease-[var(--ease-premium)] ${
                    isActive
                      ? "bg-[var(--stone)] font-medium text-[var(--oxblood)] shadow-sm"
                      : "text-[var(--ink-muted)] hover:bg-[var(--stone)]/50 hover:text-[var(--ink)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {createElement(icon, { size: 16, strokeWidth: isActive ? 2.5 : 2 })}
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="flex flex-col gap-1 border-t border-[var(--veloce-border)] p-4">
          <button
            onClick={() => navigate("/login")}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-[var(--ink-muted)] transition-all duration-[240ms] ease-[var(--ease-premium)] hover:bg-[var(--stone)]/50 hover:text-[var(--ink)]"
          >
            <LogOut size={16} className="transition-transform group-hover:-translate-x-0.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobile(false)}
          className="fixed inset-0 z-40 bg-[var(--ink)]/20 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* ── MAIN ── */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-[248px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-4 glass-nav px-8">
          <button
            onClick={() => setMobile(true)}
            className="lg:hidden text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brass-line)] bg-[var(--surface)] px-3 py-1.5 shadow-sm">
              <Sparkles size={14} className="text-[var(--brass)]" />
              <span className="text-[11px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
                Atelier Control Room
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--oxblood)] text-xs font-semibold tracking-widest text-[var(--surface)] shadow-md transition-transform hover:scale-105 cursor-pointer">
            A
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
