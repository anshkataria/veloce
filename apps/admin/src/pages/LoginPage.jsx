import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.email === "admin@veloce.in" && form.password === "admin123") {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "9px",
    border: "1px solid var(--border)",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    fontFamily: "var(--font-main)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-main)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          width: "100%",
          maxWidth: "380px",
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "var(--text-primary)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Store size={20} color="var(--bg-card)" />
          </div>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Admin Login
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              marginTop: "4px",
            }}
          >
            Sign in to manage your store
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {error && (
            <div
              style={{
                background: "var(--danger-bg)",
                color: "var(--danger)",
                fontSize: "13px",
                padding: "10px 14px",
                borderRadius: "9px",
              }}
            >
              {error}
            </div>
          )}

          {[
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "admin@veloce.in",
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "••••••••",
            },
          ].map((f) => (
            <div key={f.name}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
              >
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.name]}
                placeholder={f.placeholder}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [f.name]: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              padding: "11px",
              borderRadius: "9px",
              border: "none",
              background: "var(--accent)",
              color: "var(--accent-fg)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              marginTop: "4px",
            }}
          >
            Sign In
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          admin@veloce.in / admin123
        </p>
      </div>
    </div>
  );
}
