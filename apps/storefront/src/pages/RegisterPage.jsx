import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await authService.register(form);
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
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-shell py-12">
      <div className="auth-card fade-in-up">
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">
            VELOCE MEMBER ACCESS
          </p>
          <h1
            className="text-3xl font-light text-[#17110d]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Create an account
          </h1>
          <p className="text-sm text-[#7a6b5f] mt-2">
            Create your client profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[#f4e4e6] text-[#7f1d2d] text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {[
            {
              label: "Full Name",
              name: "name",
              type: "text",
            },
            {
              label: "Email",
              name: "email",
              type: "email",
            },
            {
              label: "Password",
              name: "password",
              type: "password",
            },
            {
              label: "Confirm Password",
              name: "confirm",
              type: "password",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-[#5f5148] mb-1.5 uppercase tracking-wide">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border border-[#d7c5aa] bg-white/75 text-[#17110d] rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:ring-1 focus:ring-[#b59663]"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full luxury-btn py-3.5 rounded-[8px] text-sm font-semibold mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-[#7a6b5f] mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#17110d] hover:text-[#7f1d2d] font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
