import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authService.login(form);
      if (res.data.role !== "ADMIN") {
        setError("Access denied. Admin accounts only.");
        return;
      }
      login(
        { name: res.data.name, email: res.data.email, role: res.data.role },
        res.data.token,
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Top Nav minimal for login */}
      <header className="sticky top-0 z-50 glass-nav flex h-[var(--header-height)] items-center px-[var(--page-gutter)]">
        <div className="font-display text-[1.35rem] font-semibold tracking-[0.32em] text-[var(--ink)] uppercase">
          VELOCE
        </div>
      </header>

      <div className="auth-layout">
        {/* Left Visual Panel */}
        <div className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80"
            alt="Luxury Car"
            className="auth-visual__image"
          />
          <div className="auth-visual__gradient" />
          <div className="auth-visual__copy">
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-[0.02em] text-[var(--surface)] sm:text-5xl lg:text-6xl">
              Atelier control room.
            </h2>
            <p className="mt-4 text-sm font-medium tracking-widest text-[var(--surface)]/80 uppercase">
              Private Operations Access
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-panel">
          <div className="auth-form fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="mb-2 text-xs font-semibold tracking-[0.2em] text-[var(--ink-muted)] uppercase">
              Veloce Operations
            </div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-supporting">
              Access the central dashboard to manage inventory and concierge operations.
            </p>

            <form onSubmit={handleSubmit} className="auth-fields">
              {error && (
                <div className="rounded-xl bg-[var(--danger-bg)] px-4 py-3 text-sm text-[var(--danger)]">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="admin-email" className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
                  Email
                </label>
                <input
                  type="email"
                  id="admin-email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="auth-input w-full rounded-xl border border-[var(--veloce-border)] bg-transparent px-4 text-sm text-[var(--ink)] transition-colors focus:border-[var(--oxblood)] focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
                  Password
                </label>
                <input
                  type="password"
                  id="admin-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="auth-input w-full rounded-xl border border-[var(--veloce-border)] bg-transparent px-4 text-sm text-[var(--ink)] transition-colors focus:border-[var(--oxblood)] focus:outline-none"
                  required
                />
              </div>

              <div className="mt-2 rounded-xl border border-[var(--veloce-border)] bg-[var(--stone)]/30 p-4 text-xs leading-relaxed text-[var(--ink-muted)]">
                <div className="mb-1 text-[10px] font-semibold tracking-widest uppercase">
                  Admin Credentials
                </div>
                <div>Email: <strong className="text-[var(--ink)]">admin@veloce.in</strong></div>
                <div>Password: <strong className="text-[var(--ink)]">admin123</strong></div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="luxury-btn auth-primary mt-2 flex w-full items-center justify-center gap-3 rounded-xl font-medium tracking-wide disabled:opacity-70"
              >
                {loading ? "Authenticating..." : "Sign In"}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
