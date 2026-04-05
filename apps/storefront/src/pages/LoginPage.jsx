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
            className="text-3xl font-light text-[#f2f4f3]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-[#a9927d] mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[#49111c] text-[#f2f4f3] text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#c7baac] mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-[#5e503f] bg-[#0a0908]/70 text-[#f2f4f3] rounded-xl px-4 py-3 text-sm
                         placeholder:text-[#7f7265] focus:outline-none focus:ring-1 focus:ring-[#a9927d]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#c7baac] uppercase tracking-wide">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-[#8e8072] hover:text-[#f2f4f3] transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-[#5e503f] bg-[#0a0908]/70 text-[#f2f4f3] rounded-xl px-4 py-3 text-sm
                         placeholder:text-[#7f7265] focus:outline-none focus:ring-1 focus:ring-[#a9927d]"
            />
          </div>

          <button
            type="submit"
            className="w-full luxury-btn py-3.5 rounded-full text-sm font-medium mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-[#a9927d] mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#f2f4f3] hover:text-[#a9927d] font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
