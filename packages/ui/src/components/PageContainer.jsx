export default function PageContainer({ children, className = "" }) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--page-max-width)] px-[var(--page-gutter)] ${className}`}
    >
      {children}
    </div>
  );
}
