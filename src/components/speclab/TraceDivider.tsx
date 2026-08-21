interface TraceDividerProps { className?: string; label?: string; }
export function TraceDivider({ className = "", label }: TraceDividerProps) {
  return (
    <div className={`flex items-center gap-3 my-6 ${className}`} role="separator">
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="flex-shrink-0 opacity-40">
        <circle cx="4" cy="8" r="3" stroke="var(--sl-accent-copper)" strokeWidth="1.5" />
        <polyline points="7,8 20,8 20,2 36,2" stroke="var(--sl-border)" strokeWidth="1" fill="none" />
        <circle cx="36" cy="2" r="2" fill="var(--sl-accent-copper)" opacity="0.5" />
      </svg>
      {label && <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "var(--sl-text-muted)", fontFamily: "var(--sl-font-mono)" }}>{label}</span>}
      <div className="flex-1 h-px" style={{ background: "var(--sl-border)" }} />
    </div>
  );
}
