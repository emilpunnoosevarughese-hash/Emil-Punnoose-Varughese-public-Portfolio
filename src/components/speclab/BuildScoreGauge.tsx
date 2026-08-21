import { useEffect, useRef } from "react";
import type { BuildScoreResult } from "../../lib/buildScore";
import { StatusChip } from "./StatusChip";

interface BuildScoreGaugeProps {
  result: BuildScoreResult | null;
  size?: "sm" | "md" | "lg";
}

function HalfStar({ filled, half }: { filled: boolean; half: boolean }) {
  const copper = "var(--sl-accent-copper)";
  const empty  = "var(--sl-border)";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <defs>
        <clipPath id="half-clip">
          <rect x="0" y="0" width="8" height="16" />
        </clipPath>
      </defs>
      <polygon points="8,1 10,6 15,6 11,9.5 12.5,14.5 8,11.5 3.5,14.5 5,9.5 1,6 6,6"
               fill={empty} />
      {half ? (
        <polygon points="8,1 10,6 15,6 11,9.5 12.5,14.5 8,11.5 3.5,14.5 5,9.5 1,6 6,6"
                 fill={copper} clipPath="url(#half-clip)" />
      ) : filled ? (
        <polygon points="8,1 10,6 15,6 11,9.5 12.5,14.5 8,11.5 3.5,14.5 5,9.5 1,6 6,6"
                 fill={copper} />
      ) : null}
    </svg>
  );
}

function Stars({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map(i => (
        <HalfStar key={i} filled={i <= Math.floor(stars)} half={i === Math.ceil(stars) && stars % 1 !== 0} />
      ))}
    </div>
  );
}

export function BuildScoreGauge({ result, size = "md" }: BuildScoreGaugeProps) {
  const needleRef = useRef<SVGLineElement>(null);

  const score  = result?.score ?? 0;
  const stars  = result?.stars ?? 0;

  // Gauge geometry
  const R     = size === "sm" ? 60 : size === "lg" ? 110 : 80;
  const cx    = R + 20;
  const cy    = R + 20;
  const svgW  = (R + 20) * 2;
  const svgH  = 1.5 * R + 30;
  const startAngle = 150;
  const endAngle   = 390;
  const totalArc   = 240; // degrees

  // Convert polar to Cartesian
  const polar = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos((angle * Math.PI) / 180),
    y: cy + radius * Math.sin((angle * Math.PI) / 180),
  });

  // Arc path
  const arcPath = (r: number, s: number, e: number) => {
    const start = polar(s, r);
    const end   = polar(e, r);
    const large = Math.abs(e - s) > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
  };

  // Score to angle (start=210deg going counter-clockwise to -30deg)
  const scoreToAngle = (s: number) => startAngle + (s / 100) * totalArc;
  const needleAngle  = scoreToAngle(score);

  // Colors for filled arc
  const scoreColor = score >= 80 ? "var(--sl-status-good)" : score >= 55 ? "var(--sl-status-caution)" : "var(--sl-status-critical)";

  // Animate needle
  useEffect(() => {
    if (!needleRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const line = needleRef.current;
    line.style.transform = `rotate(${startAngle}deg)`;
    line.style.transformOrigin = `${cx}px ${cy}px`;
    requestAnimationFrame(() => {
      line.style.transition = "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
      line.style.transform  = `rotate(${needleAngle}deg)`;
    });
  }, [score]);

  const sizes = {
    sm: { numSize: "text-2xl", labelSize: "text-[10px]", starScale: "scale-75", checkBarH: "h-1", wrapPad: "p-3" },
    md: { numSize: "text-4xl", labelSize: "text-xs",     starScale: "scale-100", checkBarH: "h-1.5", wrapPad: "p-5" },
    lg: { numSize: "text-5xl", labelSize: "text-sm",     starScale: "scale-110", checkBarH: "h-2", wrapPad: "p-6" },
  }[size];

  return (
    <div
      className={`flex flex-col items-center ${sizes.wrapPad}`}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Build Score: ${score} out of 100, ${stars} out of 5 stars`}
    >
      {/* SVG Gauge */}
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} overflow="visible">
        {/* Track */}
        <path d={arcPath(R, startAngle, endAngle)} stroke="var(--sl-border)" strokeWidth={size === "sm" ? 6 : 10} fill="none" strokeLinecap="round" />
        {/* Filled arc */}
        {score > 0 && (
          <path d={arcPath(R, startAngle, scoreToAngle(score))} stroke={scoreColor} strokeWidth={size === "sm" ? 6 : 10} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${scoreColor}88)` }} />
        )}
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map(t => {
          const a  = scoreToAngle(t);
          const p1 = polar(a, R - (size === "sm" ? 10 : 16));
          const p2 = polar(a, R - (size === "sm" ? 4 : 6));
          return <line key={t} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--sl-text-muted)" strokeWidth="1" opacity="0.4" />;
        })}
        {/* Needle */}
        <line
          ref={needleRef}
          x1={cx}
          y1={cy}
          x2={cx + R - (size === "sm" ? 14 : 20)}
          y2={cy}
          stroke="var(--sl-accent-copper)"
          strokeWidth={size === "sm" ? 2 : 3}
          strokeLinecap="round"
        />
        {/* Center hub */}
        <circle cx={cx} cy={cy} r={size === "sm" ? 5 : 8} fill="var(--sl-bg-panel-raised)" stroke="var(--sl-accent-copper)" strokeWidth="1.5" />
        {/* Score numeral */}
        <text x={cx} y={cy - (size === "sm" ? 24 : 34)} textAnchor="middle" fontSize={size === "sm" ? 22 : 36} fontWeight="700" fontFamily="var(--sl-font-mono)" fill="var(--sl-text-primary)">{score}</text>
        <text x={cx} y={cy - (size === "sm" ? 10 : 14)} textAnchor="middle" fontSize={size === "sm" ? 9 : 11} fontFamily="var(--sl-font-mono)" fill="var(--sl-text-muted)">/ 100</text>
      </svg>

      {/* Stars */}
      <div className={`flex flex-col items-center gap-1 mt-1 ${sizes.starScale} origin-top`}>
        <Stars stars={stars} />
        <span className={`${sizes.labelSize} font-medium`} style={{ color: "var(--sl-text-muted)", fontFamily: "var(--sl-font-mono)" }}>
          {stars.toFixed(1)} / 5 stars
        </span>
      </div>

      {/* Verdict */}
      {result?.verdict && size !== "sm" && (
        <p className="mt-3 text-center text-xs leading-relaxed max-w-xs" style={{ color: "var(--sl-text-muted)", fontFamily: "var(--sl-font-body)" }}>
          {result.verdict}
        </p>
      )}

      {/* Badges */}
      {result?.badges && result.badges.length > 0 && size !== "sm" && (
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {result.badges.map((b, i) => <StatusChip key={i} status={b.status} label={b.label} />)}
        </div>
      )}

      {/* Check bars */}
      {result?.checks && size === "lg" && (
        <div className="w-full mt-5 space-y-3">
          {result.checks.map(c => (
            <div key={c.id}>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--sl-text-muted)", fontFamily: "var(--sl-font-body)" }}>{c.label}</span>
                <span className="text-xs font-medium" style={{ color: c.status === "good" ? "var(--sl-status-good)" : c.status === "caution" ? "var(--sl-status-caution)" : "var(--sl-status-critical)", fontFamily: "var(--sl-font-mono)" }}>
                  {c.score}/{c.maxScore}
                </span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: "4px", background: "var(--sl-border)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(c.score / c.maxScore) * 100}%`,
                    background: c.status === "good" ? "var(--sl-status-good)" : c.status === "caution" ? "var(--sl-status-caution)" : "var(--sl-status-critical)"
                  }}
                />
              </div>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--sl-text-muted)", fontFamily: "var(--sl-font-body)" }}>{c.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



