// src/pages/Services/ServiceIllustrations.jsx
// All new process figures + hero dashboard + decision tree

const base = {
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

// ---- Small icons (keep existing) ----
export function IconQuant() { return <svg {...base}><path d="M6 32V10M6 32h28" strokeOpacity="0.35"/><rect x="10" y="22" width="4" height="10"/><rect x="17" y="15" width="4" height="17"/><rect x="24" y="19" width="4" height="13"/><path d="M11 20l7-6 7 4 5-9"/></svg>; }
export function IconQual() { return <svg {...base}><path d="M9 10h22"/><path d="M9 16h22"/><path d="M9 22h14"/><path d="M9 28h18"/><path d="M6 13v12" strokeOpacity="0.6"/><path d="M29 9l3-3M29 9l3 3" strokeOpacity="0.6"/></svg>; }
export function IconMixed() { return <svg {...base}><circle cx="16" cy="20" r="10"/><circle cx="25" cy="20" r="10" strokeDasharray="2.5 3"/></svg>; }
export function IconSurvey() { return <svg {...base}><rect x="9" y="7" width="22" height="27" rx="2"/><path d="M15 6h10a1 1 0 0 1 1 1v2H14V7a1 1 0 0 1 1-1Z"/><circle cx="14.5" cy="16" r="1.6" fill="currentColor" stroke="none"/><path d="M19 16h8"/><circle cx="14.5" cy="22" r="1.6" fill="currentColor" stroke="none"/><path d="M19 22h8"/><path d="M13 28.2l1.3 1.3 2.2-2.5"/><path d="M19 28h8"/></svg>; }
export function IconPower() { return <svg {...base}><path d="M7 27a13 13 0 0 1 26 0"/><path d="M7 27h26" strokeOpacity="0.35"/><path d="M20 27l7-10"/><circle cx="20" cy="27" r="1.8" fill="currentColor" stroke="none"/><path d="M12 27v2M20 14v2M28 27v2" strokeOpacity="0.6"/></svg>; }
export function IconCleaning() { return <svg {...base}><path d="M9 8h22l-8 12v10l-6 2V20L9 8Z"/><circle cx="14" cy="6" r="1.3" fill="currentColor" stroke="none" strokeOpacity="0.5" opacity="0.5"/><circle cx="26" cy="6" r="1.3" fill="currentColor" stroke="none" opacity="0.5"/><circle cx="20" cy="4.5" r="1.3" fill="currentColor" stroke="none" opacity="0.5"/></svg>; }
export function IconWriteup() { return <svg {...base}><rect x="10" y="6" width="20" height="28" rx="1.5"/><path d="M14 12h12"/><path d="M14 18h5M21 18h5M14 24h5M21 24h5" strokeOpacity="0.6"/><path d="M14 18v10M21 18v10" strokeOpacity="0.6"/><path d="M25 30.5l1.6 1.6 3-3.4" transform="translate(0 -3)"/></svg>; }
export function IconDecision() { return <svg {...base}><circle cx="20" cy="20" r="13"/><path d="M20 7v3M20 30v3M7 20h3M30 20h3" strokeOpacity="0.6"/><path d="M25 15l-4 6-6 4 4-6 6-4Z"/></svg>; }
export function IconSoftware() { return <svg {...base}><rect x="6" y="10" width="17" height="13" rx="1.5"/><path d="M6 13.5h17" strokeOpacity="0.6"/><rect x="16" y="19" width="17" height="13" rx="1.5"/><path d="M16 22.5h17" strokeOpacity="0.6"/></svg>; }
export function IconScope() { return <svg {...base}><rect x="8" y="24" width="24" height="7" rx="1.5"/><rect x="11" y="16" width="18" height="7" rx="1.5"/><rect x="14" y="8" width="12" height="7" rx="1.5"/></svg>; }
export function IconDefense() { return <svg {...base}><rect x="15" y="7" width="10" height="13" rx="5"/><path d="M11 17a9 9 0 0 0 18 0"/><path d="M20 26v6"/><path d="M14 34h12"/></svg>; }
export function IconFAQ() { return <svg {...base}><path d="M8 10.5A2.5 2.5 0 0 1 10.5 8h19A2.5 2.5 0 0 1 32 10.5V23a2.5 2.5 0 0 1-2.5 2.5H18l-6 5v-5h-1.5A2.5 2.5 0 0 1 8 23V10.5Z"/><path d="M16.8 14.2a3.2 3.2 0 1 1 4.6 2.9c-1 .5-1.6 1-1.6 2.1"/><circle cx="20" cy="21.5" r="0.9" fill="currentColor" stroke="none"/></svg>; }

// ---- HERO DASHBOARD: raw output → APA table transformation ----
export function HeroDashboard({ className }) {
  return (
    <svg className={className} viewBox="0 0 420 360" role="img" aria-labelledby="heroTitle">
      <title id="heroTitle">Dashboard showing raw SPSS output transformed into an APA 7 formatted results table</title>
      {/* Left panel: messy output */}
      <rect x="10" y="10" width="190" height="340" rx="8" fill="#f5f3ee" stroke="#ddd" strokeWidth="1.2" />
      <text x="24" y="34" fontSize="9" fill="#888" fontFamily="monospace">* * * * * * * * * * * * *</text>
      <text x="24" y="50" fontSize="9" fill="#888" fontFamily="monospace">* * * * * * * * * * * * *</text>
      <rect x="20" y="66" width="170" height="4" fill="#ccc" rx="1" />
      <rect x="20" y="78" width="140" height="4" fill="#ccc" rx="1" />
      <rect x="20" y="90" width="160" height="4" fill="#ccc" rx="1" />
      <rect x="20" y="104" width="50" height="12" fill="#b8862c" opacity="0.2" rx="2" />
      <rect x="20" y="124" width="170" height="4" fill="#ccc" rx="1" />
      <rect x="20" y="136" width="130" height="4" fill="#ccc" rx="1" />
      <text x="24" y="166" fontSize="8" fill="#888" fontFamily="monospace">&gt; t-test output...</text>
      <text x="24" y="182" fontSize="8" fill="#888" fontFamily="monospace">&gt; p = 0.034, d = 0.42</text>
      <text x="24" y="198" fontSize="8" fill="#888" fontFamily="monospace">&gt; Levene's F = 0.87</text>
      <rect x="20" y="218" width="170" height="4" fill="#ccc" rx="1" />
      <rect x="20" y="230" width="90" height="4" fill="#ccc" rx="1" />
      <text x="24" y="260" fontSize="8" fill="#b8862c" fontFamily="monospace">** Results not formatted **</text>
      {/* Arrow */}
      <path d="M210 180l30 0" stroke="#b8862c" strokeWidth="2.5" />
      <polygon points="240,177 248,180 240,183" fill="#b8862c" />
      {/* Right panel: clean APA table */}
      <rect x="252" y="10" width="158" height="340" rx="8" fill="#fff" stroke="#b8862c" strokeWidth="1.5" />
      <text x="266" y="34" fontSize="10" fill="#1c1c2b" fontWeight="bold">Table 1</text>
      <text x="266" y="50" fontSize="8" fill="#555" fontStyle="italic">Descriptive Statistics</text>
      <rect x="262" y="62" width="138" height="1" fill="#333" />
      <text x="266" y="78" fontSize="8" fontWeight="bold">Variable   M    SD    t    p</text>
      <text x="266" y="92" fontSize="8">Score_A   4.2  1.2  2.34 .023</text>
      <text x="266" y="106" fontSize="8">Score_B   3.8  1.4  1.92 .056</text>
      <text x="266" y="120" fontSize="8">Score_C   5.1  0.9  3.01 .003</text>
      <rect x="262" y="130" width="138" height="1" fill="#333" />
      <text x="266" y="146" fontSize="8" fontStyle="italic">Note. *p &lt; .05, **p &lt; .01</text>
      <rect x="262" y="160" width="138" height="1" fill="#ddd" strokeDasharray="2 2" />
      <text x="266" y="176" fontSize="8" fill="#b8862c" fontWeight="bold">✓ APA 7 compliant</text>
      <text x="266" y="190" fontSize="8" fill="#555">✓ Interpreted</text>
      <text x="266" y="204" fontSize="8" fill="#555">✓ Ready for Chapter 4</text>
    </svg>
  );
}

// ---- QUANTITATIVE PROCESS: 6-step flowchart ----
export function QuantProcessFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 200" role="img" aria-labelledby="quantProcessTitle">
      <title id="quantProcessTitle">Six-step process: Research Question → Variable Types → Assumption Tests → Method Selection → Run Analysis → Interpret Results</title>
      {[
        { x: 10, label: "RQ" },
        { x: 96, label: "Types" },
        { x: 182, label: "Assump." },
        { x: 268, label: "Method" },
        { x: 354, label: "Run" },
        { x: 440, label: "Interpret" },
      ].map((s, i) => (
        <g key={i}>
          <rect x={s.x} y="60" width="64" height="50" rx="10" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.4" />
          <text x={s.x + 32} y="85" fontSize="10" textAnchor="middle" fill="var(--color-text)">{i+1}</text>
          <text x={s.x + 32} y="98" fontSize="8" textAnchor="middle" fill="var(--color-text-secondary)">{s.label}</text>
          {i < 5 && <path d={`M${s.x + 64} 85l20 0`} stroke="var(--color-border)" strokeWidth="1.6" />}
        </g>
      ))}
    </svg>
  );
}

// ---- QUALITATIVE PROCESS: coding tree ----
export function QualProcessFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 220" role="img" aria-labelledby="qualProcessTitle">
      <title id="qualProcessTitle">Coding process: raw text → codes → themes → findings</title>
      <rect x="20" y="20" width="100" height="40" rx="6" fill="var(--color-bg-card)" stroke="var(--color-border)" />
      <text x="70" y="44" fontSize="9" textAnchor="middle" fill="var(--color-text-secondary)">Raw Text</text>
      <path d="M120 40l40 0" stroke="var(--color-border)" strokeWidth="1.6" />
      <rect x="160" y="20" width="100" height="40" rx="6" fill="var(--color-accent-soft)" stroke="var(--color-accent)" />
      <text x="210" y="44" fontSize="9" textAnchor="middle" fill="var(--color-text)">Codes</text>
      <path d="M260 40l40 0" stroke="var(--color-border)" strokeWidth="1.6" />
      <rect x="300" y="20" width="100" height="40" rx="6" fill="var(--color-focus)" opacity="0.15" stroke="var(--color-focus)" />
      <text x="350" y="44" fontSize="9" textAnchor="middle" fill="var(--color-text)">Themes</text>
      <path d="M400 40l40 0" stroke="var(--color-border)" strokeWidth="1.6" />
      <rect x="440" y="20" width="60" height="40" rx="6" fill="var(--color-accent)" opacity="0.2" stroke="var(--color-accent)" />
      <text x="470" y="44" fontSize="9" textAnchor="middle" fill="var(--color-text)">Findings</text>
      {/* Sub-codes example */}
      <rect x="160" y="90" width="80" height="24" rx="4" fill="#eee" stroke="#ddd" />
      <text x="200" y="106" fontSize="7" textAnchor="middle" fill="#666">Open code 1</text>
      <rect x="260" y="90" width="80" height="24" rx="4" fill="#eee" stroke="#ddd" />
      <text x="300" y="106" fontSize="7" textAnchor="middle" fill="#666">Open code 2</text>
      <path d="M200 114l0 16 100 0-60 0" stroke="#ddd" strokeWidth="1" fill="none" />
    </svg>
  );
}

// ---- MIXED METHODS: three designs ----
export function MixedProcessFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 180" role="img" aria-labelledby="mixedTitle">
      <title id="mixedTitle">Three mixed-methods designs: convergent, explanatory sequential, exploratory sequential</title>
      {[
        { x: 10, label: "Convergent", sub: "QUAN + QUAL → Merge" },
        { x: 184, label: "Explanatory Seq.", sub: "QUAN → qual" },
        { x: 358, label: "Exploratory Seq.", sub: "QUAL → quan" },
      ].map((d, i) => (
        <g key={i}>
          <rect x={d.x} y="20" width="150" height="140" rx="8" fill="var(--color-bg-card)" stroke="var(--color-border)" strokeWidth="1.2" />
          <text x={d.x + 75} y="46" fontSize="11" textAnchor="middle" fontWeight="bold">{d.label}</text>
          <path d={`M${d.x + 20} 62l40 0`} stroke="var(--color-accent)" strokeWidth="1.6" />
          <path d={`M${d.x + 90} 62l40 0`} stroke="var(--color-focus)" strokeWidth="1.6" strokeDasharray="4 4" />
          <text x={d.x + 75} y="100" fontSize="9" textAnchor="middle" fill="var(--color-text-secondary)">{d.sub}</text>
          <rect x={d.x + 30} y="120" width="90" height="20" rx="4" fill="var(--color-accent-soft)" stroke="var(--color-accent)" />
          <text x={d.x + 75} y="134" fontSize="8" textAnchor="middle" fill="var(--color-text)">Integration</text>
        </g>
      ))}
    </svg>
  );
}

// ---- SURVEY DESIGN: instrument lifecycle ----
export function SurveyProcessFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 180" role="img" aria-labelledby="surveyProcessTitle">
      <title id="surveyProcessTitle">Five-stage survey design process: Draft → Expert Review → Pilot → Reliability → Final</title>
      {["Draft", "Review", "Pilot", "Reliabil.", "Final"].map((label, i) => (
        <g key={i}>
          <rect x={i * 96 + 10} y="50" width="70" height="50" rx="8" fill={i === 3 ? "var(--color-accent-soft)" : "var(--color-bg-card)"} stroke={i === 3 ? "var(--color-accent)" : "var(--color-border)"} />
          <text x={i * 96 + 45} y="78" fontSize="9" textAnchor="middle" fill="var(--color-text)">{i+1}</text>
          <text x={i * 96 + 45} y="92" fontSize="8" textAnchor="middle" fill="var(--color-text-secondary)">{label}</text>
          {i < 4 && <path d={`M${i * 96 + 80} 75l16 0`} stroke="var(--color-border)" strokeWidth="1.6" />}
        </g>
      ))}
    </svg>
  );
}

// ---- POWER ANALYSIS: G*Power style ----
export function PowerProcessFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 200" role="img" aria-labelledby="powerProcessTitle">
      <title id="powerProcessTitle">Power analysis: effect size, alpha, power, sample size with distribution curves</title>
      <path d="M40 160l440 0" stroke="var(--color-border)" strokeWidth="1.2" />
      {/* Normal curves */}
      <path d="M120 160C140 60 200 40 240 40C280 40 340 60 360 160" fill="none" stroke="var(--color-border)" strokeWidth="1.8" />
      <path d="M200 160C220 60 280 40 320 40C360 40 420 60 440 160" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
      {/* Shaded region */}
      <path d="M320 160C340 160 360 100 360 160Z" fill="var(--color-accent-soft)" opacity="0.7" />
      <text x="340" y="140" fontSize="8" fill="var(--color-text)">Power</text>
      <text x="100" y="100" fontSize="9" fill="var(--color-text-secondary)">Effect size</text>
      <text x="420" y="90" fontSize="9" fill="var(--color-text-secondary)">Alpha</text>
    </svg>
  );
}

// ---- DATA CLEANING: messy → clean ----
export function CleaningProcessFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 200" role="img" aria-labelledby="cleaningProcessTitle">
      <title id="cleaningProcessTitle">Data cleaning: messy data with missing values and outliers transformed into clean structured dataset</title>
      {/* Messy grid */}
      <g transform="translate(20, 30)">
        {[0,1,2,3].map((r) => [0,1,2,3].map((c) => {
          const bad = (r === 1 && c === 2) || (r === 2 && c === 1);
          return <rect key={`${r}-${c}`} x={c*24} y={r*24} width="20" height="20" rx="2" fill={bad ? "var(--color-accent-soft)" : "var(--color-bg-card)"} stroke={bad ? "var(--color-accent)" : "var(--color-border)"} />;
        }))}
      </g>
      <path d="M140 120l60 0" stroke="var(--color-text)" strokeWidth="2" />
      <polygon points="200,117 210,120 200,123" fill="var(--color-text)" />
      {/* Clean grid */}
      <g transform="translate(230, 30)">
        {[0,1,2,3].map((r) => [0,1,2,3].map((c) => (
          <rect key={`${r}-${c}`} x={c*24} y={r*24} width="20" height="20" rx="2" fill="var(--color-bg-card)" stroke="var(--color-focus)" strokeWidth="1.3" />
        )))}
      </g>
    </svg>
  );
}

// ---- WRITE-UP: chapter page ----
export function WriteupProcessFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 240" role="img" aria-labelledby="writeupProcessTitle">
      <title id="writeupProcessTitle">Results chapter: heading, narrative text, APA table, interpretation notes</title>
      <rect x="30" y="20" width="460" height="200" rx="8" fill="var(--color-bg-card)" stroke="var(--color-border)" strokeWidth="1.2" />
      <rect x="50" y="40" width="120" height="10" rx="2" fill="var(--color-text)" opacity="0.75" />
      <rect x="50" y="60" width="400" height="6" rx="2" fill="var(--color-border)" />
      <rect x="50" y="72" width="380" height="6" rx="2" fill="var(--color-border)" />
      <rect x="50" y="84" width="420" height="6" rx="2" fill="var(--color-border)" />
      <rect x="50" y="100" width="420" height="70" rx="4" fill="none" stroke="var(--color-accent)" strokeWidth="1.2" />
      <text x="60" y="120" fontSize="8" fill="var(--color-text)" fontWeight="bold">Table 2. Results</text>
      <rect x="60" y="128" width="400" height="1" fill="var(--color-border)" />
      <text x="60" y="144" fontSize="8" fill="var(--color-text-secondary)">M = 4.2, SD = 1.2, t(28) = 2.34, p = .023</text>
      <text x="60" y="158" fontSize="8" fill="var(--color-text-secondary)">d = 0.42, 95% CI [0.10, 0.74]</text>
      <rect x="50" y="180" width="420" height="6" rx="2" fill="var(--color-border)" />
      <text x="60" y="200" fontSize="8" fill="var(--color-accent)" fontStyle="italic">✓ Interpreted with effect sizes</text>
    </svg>
  );
}

// ---- DECISION TREE (visual) ----
export function DecisionTreeFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 300" role="img" aria-labelledby="decisionTreeTitle">
      <title id="decisionTreeTitle">Decision tree: research question branches to descriptive, comparison, relationship, prediction, or reliability</title>
      <circle cx="260" cy="20" r="14" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.5" />
      <text x="260" y="25" fontSize="8" textAnchor="middle" fill="var(--color-text)">RQ</text>
      <path d="M260 34l0 20" stroke="var(--color-border)" strokeWidth="1.6" />
      {[
        { x: 40, label: "Describe" },
        { x: 130, label: "Compare" },
        { x: 220, label: "Relate" },
        { x: 310, label: "Predict" },
        { x: 400, label: "Reliabl." },
      ].map((b, i) => (
        <g key={i}>
          <path d={`M260 54l${b.x - 260} ${16 + i*8}`} stroke="var(--color-border)" strokeWidth="1.4" />
          <rect x={b.x} y={70 + i*8} width="80" height="28" rx="6" fill="var(--color-bg-card)" stroke="var(--color-focus)" strokeWidth="1.2" />
          <text x={b.x + 40} y={88 + i*8} fontSize="8" textAnchor="middle" fill="var(--color-text)">{b.label}</text>
        </g>
      ))}
      {/* Further branches for "Compare" */}
      <path d="M170 94l-20 60" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
      <rect x="70" y="154" width="90" height="20" rx="4" fill="var(--color-accent-soft)" stroke="var(--color-accent)" />
      <text x="115" y="167" fontSize="7" textAnchor="middle" fill="var(--color-text)">t-test / ANOVA</text>
    </svg>
  );
}

// ---- DEFENSE PREP: podium + committee ----
export function DefenseProcessFigure({ className }) {
  return (
    <svg className={className} viewBox="0 0 520 220" role="img" aria-labelledby="defenseProcessTitle">
      <title id="defenseProcessTitle">Defense preparation: speaker at podium with three committee members and a question bubble</title>
      <rect x="210" y="80" width="100" height="60" rx="6" fill="var(--color-bg-card)" stroke="var(--color-border)" />
      <rect x="230" y="60" width="60" height="20" rx="4" fill="var(--color-accent-soft)" stroke="var(--color-accent)" />
      <circle cx="260" cy="40" r="14" fill="none" stroke="var(--color-text)" strokeWidth="1.6" />
      {/* Committee members */}
      {[60, 260, 460].map((x, i) => (
        <g key={i} transform={`translate(${x}, 140)`}>
          <circle cx="0" cy="0" r="16" fill="none" stroke="var(--color-focus)" strokeWidth="1.4" />
          <path d={`M-20 30c0-14 6-20 20-20s20 6 20 20`} fill="none" stroke="var(--color-focus)" strokeWidth="1.4" />
        </g>
      ))}
      {/* Question bubble */}
      <path d="M310 20a20 20 0 1 1 6 28l-4 10-4-10a20 20 0 0 1 2-28Z" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.2" />
    </svg>
  );
}