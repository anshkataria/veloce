import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await authService.login(form);
      login(
        {
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        },
        res.data.token,
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card fade-in-up">
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">
            VELOCE MEMBER ACCESS
          </p>
          <h1
            className="text-3xl font-light text-[#17110d]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-[#7a6b5f] mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[#f4e4e6] text-[#7f1d2d] text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#5f5148] mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[#d7c5aa] bg-white/75 text-[#17110d] rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#b59663]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#5f5148] uppercase tracking-wide">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-[#7a6b5f] hover:text-[#17110d] transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-[#d7c5aa] bg-white/75 text-[#17110d] rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#b59663]"
            />
          </div>

          <button
            type="submit"
            className="w-full luxury-btn py-3.5 rounded-[8px] text-sm font-semibold mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-[#7a6b5f] mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#17110d] hover:text-[#7f1d2d] font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
