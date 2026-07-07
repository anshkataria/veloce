import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthAccessShell, AuthField } from "../components/AuthAccessShell";
import VeloceArrow from "../components/VeloceArrow";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
    setFieldErrors((current) => ({ ...current, [event.target.name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name) nextErrors.name = "Enter your full name.";
    if (!form.email) nextErrors.email = "Enter your email address.";
    if (!form.password) nextErrors.password = "Create a password.";
    if (form.password && form.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }
    if (form.password !== form.confirm) {
      nextErrors.confirm = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Review the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(form);
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
      setError(err.response?.data?.error || "We couldn't create this account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthAccessShell image="/images/cars/mclaren-720s.jpg">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">
        VELOCE member access
      </p>
      <h1
        className="mt-4 text-[clamp(2.65rem,5vw,4.25rem)] font-light leading-[0.96] text-[var(--ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Create your account
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--ink-muted)]">
        Create a private profile for selections and reservations.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p
            role="alert"
            className="border-l-2 border-[#a93d45] py-1 pl-3 text-sm text-[#a93d45]"
          >
            {error}
          </p>
        )}

        <AuthField
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          error={fieldErrors.name}
        />
        <AuthField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          error={fieldErrors.email}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          error={fieldErrors.password}
        />
        <AuthField
          label="Confirm password"
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          autoComplete="new-password"
          error={fieldErrors.confirm}
        />

        <button
          type="submit"
          disabled={loading}
          data-cursor="link"
          className="group inline-flex h-12 w-full items-center justify-center gap-4 rounded-[8px] bg-[var(--oxblood)] px-6 text-sm font-semibold text-[var(--surface)] transition-all duration-[320ms] ease-[var(--ease-premium)] hover:bg-[var(--veloce-oxblood-deep)] active:scale-[0.985] disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create account"}
          {!loading && <VeloceArrow />}
        </button>
      </form>

      <p className="mt-7 text-sm text-[var(--ink-muted)]">
        Already a member?{" "}
        <Link
          to="/login"
          data-cursor="link"
          className="font-semibold text-[var(--ink)] transition-colors hover:text-[var(--oxblood)]"
        >
          Sign in
        </Link>
      </p>
    </AuthAccessShell>
  );
}
