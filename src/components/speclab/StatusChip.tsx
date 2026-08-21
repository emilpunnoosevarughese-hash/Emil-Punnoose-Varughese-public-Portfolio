import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type StatusType = "good" | "caution" | "critical" | "info";

interface StatusChipProps {
  status: StatusType;
  label: string;
  className?: string;
}

const CONFIG = {
  good:     { color: "var(--sl-status-good)",     bg: "rgba(62,207,142,0.1)",  Icon: CheckCircle,    text: "Pass" },
  caution:  { color: "var(--sl-status-caution)",  bg: "rgba(242,184,75,0.1)",  Icon: AlertTriangle,  text: "Warn" },
  critical: { color: "var(--sl-status-critical)", bg: "rgba(255,92,92,0.1)",   Icon: XCircle,        text: "Fail" },
  info:     { color: "var(--sl-accent-signal)",   bg: "rgba(76,141,255,0.1)",  Icon: CheckCircle,    text: "Info" },
};

export function StatusChip({ status, label, className = "" }: StatusChipProps) {
  const { color, bg, Icon } = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
      style={{ color, backgroundColor: bg, borderColor: `${color}33`, fontFamily: "var(--sl-font-body)" }}
      aria-label={`${status}: ${label}`}
    >
      <Icon size={11} aria-hidden="true" />
      {label}
    </span>
  );
}
