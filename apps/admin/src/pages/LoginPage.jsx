import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend
    if (form.email === "admin@store.com" && form.password === "admin123") {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-2xl mb-4">
            <Store size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to manage your store
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {[
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "admin@store.com",
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "••••••••",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                {field.label}
              </label>
              <input
                type={field.type}
                value={form[field.name]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field.name]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium
                       hover:bg-gray-700 transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Use admin@store.com / admin123
        </p>
      </div>
    </div>
  );
}
