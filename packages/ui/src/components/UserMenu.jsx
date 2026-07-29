import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";

export default function UserMenu({ name, email, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--oxblood)] text-xs font-semibold tracking-widest text-[var(--surface)] shadow-md transition-transform hover:scale-105"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-xl border border-[var(--veloce-border)] bg-[var(--surface)] shadow-[var(--veloce-shadow)]">
          <div className="border-b border-[var(--veloce-line)] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[var(--ink)]">{name || "Admin"}</p>
            {email && (
              <p className="truncate text-xs text-[var(--ink-muted)]">{email}</p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-[13px] text-[var(--ink-muted)] transition-colors hover:bg-[var(--stone)]/50 hover:text-[var(--ink)]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
