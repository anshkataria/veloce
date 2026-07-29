export default function LoadingState({ variant = "spinner", rows = 3, message = "Loading..." }) {
  if (variant === "skeleton") {
    return (
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-[var(--stone)]/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-12 text-center text-sm text-[var(--ink-muted)]">{message}</div>
  );
}
