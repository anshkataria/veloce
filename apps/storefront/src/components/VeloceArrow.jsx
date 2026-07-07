export default function VeloceArrow({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 34 12"
      fill="none"
      className={`h-3 w-8 transition-transform duration-[360ms] ease-[var(--ease-premium)] group-hover:translate-x-1.5 ${className}`}
    >
      <path
        d="M1 6H31"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M26.5 1.5L31 6L26.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
