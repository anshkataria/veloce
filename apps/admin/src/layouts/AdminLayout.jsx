import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
          width: "220px",
          flexShrink: 0,
          background: "var(--sidebar-bg)",
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
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Store size={15} color="white" />
            </div>
            <span
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.05em",
              }}
            >
              VELOCE ADMIN
            </span>
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
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          <p
            style={{
              color: "var(--sidebar-text)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              padding: "8px 10px 6px",
              textTransform: "uppercase",
            }}
          >
            Menu
          </p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 10px",
                borderRadius: "8px",
                marginBottom: "2px",
                color: isActive
                  ? "var(--sidebar-active)"
                  : "var(--sidebar-text)",
                background: isActive
                  ? "var(--sidebar-active-bg)"
                  : "transparent",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: isActive ? 500 : 400,
                transition: "all 0.15s",
              })}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div
          style={{
            padding: "12px 10px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
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
              padding: "9px 10px",
              borderRadius: "8px",
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
                background: dark ? "#4ade80" : "rgba(255,255,255,0.15)",
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
                  background: "white",
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
              padding: "9px 10px",
              borderRadius: "8px",
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
          marginLeft: "220px",
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
            height: "60px",
            background: "var(--bg-card)",
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
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--bg-input)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-secondary)",
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
