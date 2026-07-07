import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { createElement } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Store,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/orders", icon: ShoppingBag, label: "Orders" },
];

export default function AdminLayout() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("admin-theme") === "dark",
  );
  const [mobileOpen, setMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
    localStorage.setItem("admin-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: "248px",
          flexShrink: 0,
          background: "var(--sidebar-bg)",
          borderRight: "1px solid rgba(181, 150, 99, 0.28)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : undefined,
          transition: "transform 0.3s",
        }}
        className={!mobileOpen ? "max-lg:hidden lg:flex" : "flex"}
      >
        {/* Logo */}
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid rgba(181, 150, 99, 0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                background: "var(--sidebar-active-bg)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Store size={15} color="var(--sidebar-active)" />
            </div>
            <div>
              <span
                style={{
                  color: "var(--sidebar-active-bg)",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.18em",
                }}
              >
                VELOCE
              </span>
              <p
                style={{
                  color: "var(--sidebar-text)",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Operations
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobile(false)}
            className="lg:hidden"
            style={{ color: "var(--sidebar-text)" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 12px" }}>
          <p
            style={{
              color: "var(--sidebar-text)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              padding: "8px 10px 10px",
              textTransform: "uppercase",
            }}
          >
            Menu
          </p>
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 12px",
                borderRadius: "10px",
                marginBottom: "5px",
                color: isActive
                  ? "var(--sidebar-active)"
                  : "var(--sidebar-text)",
                background: isActive
                  ? "var(--sidebar-active-bg)"
                  : "transparent",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: isActive ? 500 : 400,
                transition: "all 0.22s ease",
              })}
            >
              {createElement(icon, { size: 15 })}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div
          style={{
            padding: "12px 10px",
            borderTop: "1px solid rgba(181, 150, 99, 0.28)",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {/* Dark mode toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: "10px",
              width: "100%",
              color: "var(--sidebar-text)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
              {dark ? "Light mode" : "Dark mode"}
            </span>
            {/* Toggle pill */}
            <div
              style={{
                width: "32px",
                height: "18px",
                borderRadius: "9px",
                background: dark ? "var(--accent)" : "var(--sidebar-active-bg)",
                position: "relative",
                transition: "background 0.3s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: dark ? "17px" : "3px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "var(--accent-fg)",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </button>

          <button
            onClick={() => navigate("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              width: "100%",
              color: "var(--sidebar-text)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobile(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* ── MAIN ── */}
      <div
        style={{
          marginLeft: "248px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
        className="max-lg:ml-0"
      >
        {/* Topbar */}
        <header
          style={{
            height: "68px",
            background: "rgba(255, 250, 242, 0.82)",
            backdropFilter: "blur(18px)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: "12px",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setMobile(true)}
            className="lg:hidden"
            style={{ color: "var(--text-secondary)" }}
          >
            <Menu size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 10px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                background: "var(--bg-input)",
                color: "var(--text-secondary)",
                fontSize: "12px",
              }}
            >
              <Sparkles size={13} color="var(--accent)" />
              Atelier control room
            </div>
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--accent-fg)",
            }}
          >
            A
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "28px 28px", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
