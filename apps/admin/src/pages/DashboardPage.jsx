import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/orders", icon: ShoppingBag, label: "Orders" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth token
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── SIDEBAR ── */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-gray-700" />
            <span className="text-sm font-semibold tracking-widest uppercase text-gray-900">
              Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500
                       hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-900"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="text-sm text-gray-500">
            Welcome, <span className="font-medium text-gray-900">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
