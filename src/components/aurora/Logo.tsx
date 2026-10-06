export function AuroraMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="aur-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--aurora-1)" />
          <stop offset="1" stopColor="var(--aurora-2)" />
        </linearGradient>
      </defs>
      <path d="M6 28a14 14 0 0 1 28 0" fill="url(#aur-g)" />
      <path d="M3 32h34" stroke="url(#aur-g)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 36h20" stroke="url(#aur-g)" strokeWidth="2" strokeLinecap="round" opacity=".6" />
      <path d="M20 4v5M8 10l3 3M32 10l-3 3" stroke="url(#aur-g)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
