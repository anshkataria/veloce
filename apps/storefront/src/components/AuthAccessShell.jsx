import { useState } from "react";

function EyeGlyph({ closed = false }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M3.8 12C5.55 8.8 8.3 7.2 12 7.2C15.7 7.2 18.45 8.8 20.2 12C18.45 15.2 15.7 16.8 12 16.8C8.3 16.8 5.55 15.2 3.8 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      {closed && (
        <path
          d="M5.2 18.8L18.8 5.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function AuthAccessShell({ children, image = "/images/cars/aston-martin-db12.jpg" }) {
  return (
    <main className="grid min-h-[calc(100svh-3.5rem)] bg-[var(--canvas)] lg:grid-cols-[minmax(0,0.95fr)_minmax(28rem,0.85fr)]">
      <section className="relative hidden overflow-hidden bg-[var(--dark-surface)] lg:block">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover opacity-82"
          style={{ objectPosition: "48% 50%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-surface)] via-[color-mix(in_srgb,var(--dark-surface)_32%,transparent)] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[var(--dark-surface)]/40 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-sm text-[var(--surface)]">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--surface)_72%,transparent)]">
            Private client access
          </p>
          <h2
            className="mt-4 text-5xl font-light leading-[0.96]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your collection,
            <br />
            continued.
          </h2>
        </div>
      </section>

      <section className="flex items-center px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-[28rem]">{children}</div>
      </section>
    </main>
  );
}

export function AuthField({
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
  error,
  labelAction,
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <label
          htmlFor={name}
          className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]"
        >
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`h-14 w-full rounded-[8px] border bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] px-4 text-sm text-[var(--ink)] outline-none transition-colors duration-[260ms] ease-[var(--ease-premium)] hover:border-[var(--ink-muted)] focus:border-[var(--oxblood)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--oxblood)_16%,transparent)] ${
            error ? "border-[#a93d45]" : "border-[var(--brass-line-strong)]"
          } ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((state) => !state)}
            data-cursor="link"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[8px] text-[var(--ink-muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_58%,transparent)] hover:text-[var(--oxblood)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oxblood)]"
          >
            <EyeGlyph closed={visible} />
          </button>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-[#a93d45]">
          {error}
        </p>
      )}
    </div>
  );
}
