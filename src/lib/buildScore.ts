export interface BuildSelection {
  cpu?: any;
  gpu?: any;
  motherboard?: any;
  ram?: any;
  storage?: any;
  psu?: any;
  case?: any;
}

export interface CheckResult {
  id: string;
  label: string;
  score: number;     // 0-100 for this check
  maxScore: number;
  status: "good" | "caution" | "critical";
  detail: string;
}

export interface Badge {
  label: string;
  status: "good" | "caution" | "critical" | "info";
}

export interface BuildScoreResult {
  score: number;
  stars: number;
  verdict: string;
  checks: CheckResult[];
  badges: Badge[];
}

function getSpec(product: any, key: string): any {
  return product?.spec?.[key] ?? (product as any)?.[key];
}

// ── 1. Compatibility check (30pts) ──────────────────────────────────────────
function checkCompatibility(sel: BuildSelection): CheckResult {
  let score = 30;
  const issues: string[] = [];

  if (sel.cpu && sel.motherboard) {
    const cpuSocket = getSpec(sel.cpu, "socket");
    const mbSocket  = getSpec(sel.motherboard, "socket");
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      score -= 15;
      issues.push(`Socket mismatch (${cpuSocket} vs ${mbSocket})`);
    }
  }

  if (sel.ram && sel.motherboard) {
    const ramType = getSpec(sel.ram, "type") || getSpec(sel.ram, "ddr_type");
    const mbRam   = getSpec(sel.motherboard, "ram_type");
    const mbRamArr = Array.isArray(mbRam) ? mbRam : [mbRam];
    if (ramType && mbRam && !mbRamArr.some((t: string) => t?.includes(ramType) || ramType?.includes(t))) {
      score -= 10;
      issues.push(`RAM type mismatch (${ramType} vs ${mbRamArr.join("/")})`);
    }
  }

  const detail = issues.length === 0
    ? "All checked components are compatible"
    : issues.join("; ");
  const status = score >= 25 ? "good" : score >= 15 ? "caution" : "critical";
  return { id: "compatibility", label: "Compatibility", score, maxScore: 30, status, detail };
}

// ── 2. Balance check (20pts) ─────────────────────────────────────────────────
function checkBalance(sel: BuildSelection): CheckResult {
  let score = 20;
  let detail = "Component tiers look balanced";
  let status: CheckResult["status"] = "good";

  if (sel.cpu && sel.gpu) {
    const cpuBench = getSpec(sel.cpu, "benchmark_score") || 0;
    const gpuBench = getSpec(sel.gpu, "benchmark_score") || 0;
    const cpuPrice = (sel.cpu as any).price_inr || 0;
    const gpuPrice = (sel.gpu as any).price_inr || 0;

    if (cpuBench > 0 && gpuBench > 0) {
      const ratio = gpuBench / cpuBench;
      if (ratio > 4) {
        score -= 10; status = "caution";
        detail = "GPU-CPU bottleneck risk: GPU is significantly more powerful than CPU";
      } else if (ratio < 0.3 && cpuPrice > 0) {
        score -= 8; status = "caution";
        detail = "CPU-GPU imbalance: CPU may bottleneck this GPU";
      }
    } else if (cpuPrice > 0 && gpuPrice > 0) {
      const priceRatio = gpuPrice / cpuPrice;
      if (priceRatio > 5) { score -= 8; status = "caution"; detail = "GPU/CPU price ratio suggests possible bottleneck"; }
    }
  }
  return { id: "balance", label: "Balance", score, maxScore: 20, status, detail };
}

// ── 3. Power headroom (20pts) ────────────────────────────────────────────────
function checkPower(sel: BuildSelection): CheckResult {
  const psuWatts  = getSpec(sel.psu, "wattage") || getSpec(sel.psu, "rated_wattage") || 0;
  const cpuTdp    = getSpec(sel.cpu, "tdp_w") || 65;
  const gpuTdp    = getSpec(sel.gpu, "tdp_w") || 150;
  const totalTdp  = cpuTdp + gpuTdp + 60; // ~60W for platform

  let score = 20;
  let detail = "";
  let status: CheckResult["status"] = "good";

  if (psuWatts === 0) {
    detail = "No PSU selected — power headroom unknown";
    status = "caution"; score = 10;
  } else {
    const headroom = psuWatts - (totalTdp * 1.2);
    if (headroom < 0) {
      score = 0; status = "critical";
      detail = `PSU (${psuWatts}W) insufficient — estimated draw ~${Math.round(totalTdp * 1.2)}W`;
    } else if (headroom < 50) {
      score = 8; status = "caution";
      detail = `Low headroom: ~${Math.round(headroom)}W spare after estimated ${Math.round(totalTdp * 1.2)}W draw`;
    } else {
      detail = `Good: ~${Math.round(headroom)}W spare (PSU ${psuWatts}W, est. draw ${Math.round(totalTdp * 1.2)}W)`;
    }
  }

  return { id: "power", label: "Power Headroom", score, maxScore: 20, status, detail };
}

// ── 4. Value check (15pts) ───────────────────────────────────────────────────
function checkValue(sel: BuildSelection): CheckResult {
  const parts = [sel.cpu, sel.gpu, sel.ram, sel.motherboard, sel.storage].filter(Boolean);
  const totalPrice = parts.reduce((s, p) => s + ((p as any).price_inr || 0), 0);
  const benchScores = [sel.cpu, sel.gpu]
    .filter(Boolean)
    .map(p => getSpec(p, "benchmark_score") || 0)
    .filter(s => s > 0);
  const avgBench = benchScores.length ? benchScores.reduce((a, b) => a + b, 0) / benchScores.length : 0;

  let score = 15;
  let detail = "Value appears reasonable for the performance tier";
  let status: CheckResult["status"] = "good";

  if (totalPrice > 0 && avgBench > 0) {
    const pricePerPoint = totalPrice / avgBench;
    if (pricePerPoint > 15) { score = 5; status = "caution"; detail = `High cost per performance point (₹${Math.round(pricePerPoint)}/pt)`; }
    else if (pricePerPoint < 5) { score = 15; detail = `Excellent value (₹${Math.round(pricePerPoint)}/pt)`; }
    else { detail = `Good value (₹${Math.round(pricePerPoint)}/pt)`; }
  } else if (parts.length < 2) {
    score = 8; status = "caution"; detail = "Add more components for a value assessment";
  }

  return { id: "value", label: "Value", score, maxScore: 15, status, detail };
}

// ── 5. Upgradability (15pts) ─────────────────────────────────────────────────
function checkUpgradability(sel: BuildSelection): CheckResult {
  const ramSlots   = getSpec(sel.motherboard, "ram_slots") || 0;
  const m2Slots    = getSpec(sel.motherboard, "m2_slots") || 0;
  const psuWatts   = getSpec(sel.psu, "wattage") || 0;

  let score = 15;
  const upsides: string[] = [];
  let status: CheckResult["status"] = "good";

  if (ramSlots >= 4) upsides.push(`${ramSlots} RAM slots`);
  else if (ramSlots === 2) { score -= 3; upsides.push("2 RAM slots (limited)"); }

  if (m2Slots >= 2) upsides.push(`${m2Slots} M.2 slots`);
  else if (m2Slots === 1) { score -= 2; }

  if (psuWatts > 0) {
    const cpuTdp = getSpec(sel.cpu, "tdp_w") || 65;
    const gpuTdp = getSpec(sel.gpu, "tdp_w") || 150;
    const surplus = psuWatts - (cpuTdp + gpuTdp + 60) * 1.2;
    if (surplus > 150) upsides.push(`${Math.round(surplus)}W PSU surplus`);
    else if (surplus < 50) { score -= 4; status = "caution"; }
  }

  const detail = upsides.length ? upsides.join(", ") : (sel.motherboard ? "Limited upgrade paths detected" : "Add motherboard for upgrade assessment");
  if (score < 8) status = "caution";

  return { id: "upgradability", label: "Upgradability", score, maxScore: 15, status, detail };
}

// ── Main scorer ──────────────────────────────────────────────────────────────
export function scoreBuild(sel: BuildSelection): BuildScoreResult {
  const checks = [
    checkCompatibility(sel),
    checkBalance(sel),
    checkPower(sel),
    checkValue(sel),
    checkUpgradability(sel),
  ];

  const totalScore = checks.reduce((s, c) => s + c.score, 0);
  const stars = Math.min(5, Math.round((totalScore / 100) * 10) / 2); // 0.5 increments

  // Badges
  const badges: Badge[] = [];
  const compat = checks.find(c => c.id === "compatibility")!;
  const balance = checks.find(c => c.id === "balance")!;
  const power   = checks.find(c => c.id === "power")!;
  const value   = checks.find(c => c.id === "value")!;
  const upg     = checks.find(c => c.id === "upgradability")!;

  if (compat.status === "good")    badges.push({ label: "Compatible", status: "good" });
  if (compat.status === "critical") badges.push({ label: "Compatibility Issue", status: "critical" });
  if (balance.status === "caution") badges.push({ label: "Bottleneck Risk", status: "caution" });
  if (balance.status === "good" && sel.cpu && sel.gpu) badges.push({ label: "Well Balanced", status: "good" });
  if (power.status === "critical")  badges.push({ label: "PSU Insufficient", status: "critical" });
  if (power.status === "caution")   badges.push({ label: "Low Power Headroom", status: "caution" });
  if (value.score >= 12)            badges.push({ label: "Great Value", status: "good" });
  if (upg.score >= 12)              badges.push({ label: "Upgradable", status: "good" });

  // Verdict
  const criticals = checks.filter(c => c.status === "critical");
  const cautions  = checks.filter(c => c.status === "caution");
  let verdict = "";
  if (criticals.length > 0) {
    verdict = `Critical issue detected: ${criticals[0].detail.split("(")[0].trim()}.`;
  } else if (totalScore >= 85) {
    verdict = "Excellent build — well balanced, compatible, and great value.";
  } else if (totalScore >= 70) {
    verdict = cautions.length ? `Solid build — ${cautions[0].detail.toLowerCase()}.` : "Solid build with no major issues.";
  } else if (totalScore >= 50) {
    verdict = `Adequate build — some areas to improve: ${cautions.map(c => c.label.toLowerCase()).join(", ")}.`;
  } else {
    verdict = "Several issues found — review the checks below before purchasing.";
  }

  return { score: totalScore, stars, verdict, checks, badges };
}
