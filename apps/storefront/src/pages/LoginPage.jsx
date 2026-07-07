import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthAccessShell, AuthField } from "../components/AuthAccessShell";
import VeloceArrow from "../components/VeloceArrow";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(form);
      login(
        {
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        },
        response.data.token,
      );
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "We couldn't sign you in. Check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthAccessShell image="/images/cars/aston-martin-db12.jpg">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">
        VELOCE member access
      </p>
      <h1
        className="mt-4 text-[clamp(2.75rem,5vw,4.4rem)] font-light leading-[0.96] text-[var(--ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Welcome back
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--ink-muted)]">
        Access your saved selections and reservation details.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
        {searchParams.get("recover") === "password" && (
          <p className="border-l-2 border-[var(--brass-line-strong)] py-1 pl-3 text-sm text-[var(--ink-muted)]">
            Password recovery is not connected yet.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="border-l-2 border-[#a93d45] py-1 pl-3 text-sm text-[#a93d45]"
          >
            {error}
          </p>
        )}

        <AuthField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <AuthField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          labelAction={
            <Link
              to="/login?recover=password"
              data-cursor="link"
              className="text-xs font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--oxblood)]"
            >
              Forgot password?
            </Link>
          }
        />

        <button
          type="submit"
          disabled={loading}
          data-cursor="link"
          className="group inline-flex h-12 w-full items-center justify-center gap-4 rounded-[8px] bg-[var(--oxblood)] px-6 text-sm font-semibold text-[var(--surface)] transition-all duration-[320ms] ease-[var(--ease-premium)] hover:bg-[var(--veloce-oxblood-deep)] active:scale-[0.985] disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <VeloceArrow />}
        </button>
      </form>

      <p className="mt-7 text-sm text-[var(--ink-muted)]">
        New to VELOCE?{" "}
        <Link
          to="/register"
          data-cursor="link"
          className="font-semibold text-[var(--ink)] transition-colors hover:text-[var(--oxblood)]"
        >
          Create an account
        </Link>
      </p>
    </AuthAccessShell>
  );
}
