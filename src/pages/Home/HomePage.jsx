// src/pages/Home/HomePage.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ClipboardCheck, ListChecks, BarChart3, ShieldCheck, Table2, Brain,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Star, GraduationCap,
  Users, Award, Clock, HeartHandshake, Lock, MessageCircle, CheckCircle2,
} from "lucide-react";
import SEO from "../../components/SEO/SEO";
import styles from "./HomePage.module.css";

const CONTACT_URL = "https://www.scapedatasolutions.com/contact";
const PORTAL_URL = "https://portal.scapedatasolutions.com/";

const ROTATING_WORDS = ["Clear Results", "Defensible Findings", "APA-Ready Tables", "Confident Defenses", "Answers You Understand"];

function useTypewriter(words, speed = 90, pause = 2200) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let t;
    if (!deleting && text.length < current.length) {
      setHolding(false);
      t = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
    } else if (!deleting && text.length === current.length) {
      setHolding(true);
      t = setTimeout(() => { setHolding(false); setDeleting(true); }, pause);
    } else if (deleting && text.length > 0) {
      t = setTimeout(() => setText(current.slice(0, text.length - 1)), speed / 2);
    } else {
      setDeleting(false);
      setWordIndex((i) => i + 1);
    }
    return () => clearTimeout(t);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return { text, holding };
}

/* ---------- feature mini-visuals ---------- */
function CleaningViz() {
  const lines = [
    { c: "#eab308", t: "3 missing values found" },
    { c: "#b8862c", t: "12 duplicates removed" },
    { c: "#1e8e5a", t: "dataset ready" },
  ];
  return (
    <div className={styles.vizTerminal}>
      <div className={styles.vizTermDots}>
        <span style={{ background: "#ff5f57" }} />
        <span style={{ background: "#febc2e" }} />
        <span style={{ background: "#28c840" }} />
      </div>
      <div className={styles.vizTermBody}>
        <div className={styles.vizProgressRow}>
          <span>N = 214</span>
          <span className={styles.vizProgressPct}>98% clean</span>
        </div>
        <div className={styles.vizProgressTrack}>
          <div className={styles.vizProgressFill} />
        </div>
        <div className={styles.vizLogStack}>
          {lines.map((l, i) => (
            <div key={i} className={styles.vizLogLine}>
              <span className={styles.vizLogDot} style={{ background: l.c }} />
              {l.t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestingViz() {
  return (
    <div className={styles.vizPanel}>
      <div className={styles.vizPanelHead}>
        <span>Independent-Samples t-Test</span>
        <span className={styles.vizPanelBadge}>p = .002</span>
      </div>
      <svg viewBox="0 0 220 130" className={styles.vizChartSvg} preserveAspectRatio="xMidYMid meet">
        <line x1="14" y1="20" x2="206" y2="20" className={styles.vizGrid} />
        <line x1="14" y1="55" x2="206" y2="55" className={styles.vizGrid} />
        <line x1="14" y1="90" x2="206" y2="90" className={styles.vizGrid} />
        <line x1="14" y1="90" x2="206" y2="90" className={styles.vizAxis} />
        <rect x="52" y="46" width="34" height="44" rx="3" className={styles.vizBarRect} />
        <rect x="134" y="18" width="34" height="72" rx="3" className={styles.vizBarRectAlt} />
        <path d="M69 40 L69 34 L151 34 L151 12" className={styles.vizBracket} fill="none" />
        <text x="110" y="10" textAnchor="middle" className={styles.vizStar}>*</text>
        <text x="69" y="105" textAnchor="middle" className={styles.vizAxisLabel}>Group A</text>
        <text x="151" y="105" textAnchor="middle" className={styles.vizAxisLabel}>Group B</text>
        <text x="69" y="122" textAnchor="middle" className={styles.vizAxisSub}>M = 3.42</text>
        <text x="151" y="122" textAnchor="middle" className={styles.vizAxisSub}>M = 4.05</text>
      </svg>
    </div>
  );
}

function AssumptionViz() {
  const checks = ["Normality", "Homogeneity", "Linearity", "No multicollinearity"];
  return (
    <div className={styles.vizChecklist}>
      <div className={styles.vizChecklistHead}>
        <span>Assumptions</span>
        <span className={styles.vizChecklistBadge}>4 / 4 met</span>
      </div>
      <div className={styles.vizCheckGrid}>
        {checks.map((c, i) => (
          <div key={c} className={styles.vizCheckCell} style={{ animationDelay: `${i * 0.12}s` }}>
            <span className={styles.vizCheckMark}>✓</span>
            <span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApaViz() {
  return (
    <div className={styles.vizTablePreview}>
      <div className={styles.vizTableCaption}>
        <span>Table 1</span>
        <Table2 size={13} />
      </div>
      <div className={styles.vizTableGrid}>
        <span></span><span>M</span><span>SD</span><span>n</span>
        <span>Group A</span><span>3.42</span><span>0.61</span><span>107</span>
        <span>Group B</span><span>4.05</span><span>0.58</span><span>107</span>
      </div>
      <div className={styles.vizTableFoot}>Note. *p &lt; .01</div>
    </div>
  );
}

const FEATURES = [
  { key: "clean", title: "Dataset Cleaning", icon: <ClipboardCheck size={22} />, Viz: CleaningViz },
  { key: "test", title: "Statistical Testing", icon: <BarChart3 size={22} />, Viz: TestingViz },
  { key: "assume", title: "Assumption Checks", icon: <ShieldCheck size={22} />, Viz: AssumptionViz },
  { key: "apa", title: "APA Tables", icon: <Table2 size={22} />, Viz: ApaViz },
];

const SERVICES = [
  { icon: <ClipboardCheck size={20} />, title: "Dataset Review & Cleaning", desc: "Variable names, labels, coding, missing values, duplicates, and outliers, checked before any test runs.", tags: ["Missing data", "Duplicates", "Outliers"] },
  { icon: <ListChecks size={20} />, title: "Test Selection", desc: "Each research question and hypothesis matched to the method that fits your variables and design.", tags: ["Variable type", "Group structure", "Sample size"] },
  { icon: <BarChart3 size={20} />, title: "SPSS, R & Stata Analysis", desc: "t-tests, ANOVA, regression, chi-square, reliability, and more, run accurately and documented clearly.", tags: ["t-test", "ANOVA", "Regression"] },
  { icon: <ShieldCheck size={20} />, title: "Assumption Checks", desc: "Normality, homogeneity of variance, linearity, and multicollinearity, reviewed before interpretation.", tags: ["Normality", "Homogeneity", "Linearity"] },
  { icon: <Table2 size={20} />, title: "APA Tables & Figures", desc: "Clean, consistent, publication-ready tables for every test in your results chapter.", tags: ["APA 7", "Tables", "Figures"] },
  { icon: <Brain size={20} />, title: "Results Interpretation", desc: "Plain-language explanation of what your findings mean for each hypothesis, ready to defend.", tags: ["Plain language", "Defense-ready"] },
];

const SOFTWARE = [
  { name: "SPSS" }, { name: "R" }, { name: "Python" }, { name: "Stata" }, { name: "Excel" }, { name: "Jamovi" },
];
const SOFT_DUP = [...SOFTWARE, ...SOFTWARE];

const FIELDS = [
  { icon: <GraduationCap size={18} />, name: "Education" },
  { icon: <Users size={18} />, name: "Business & Management" },
  { icon: <Brain size={18} />, name: "Psychology" },
  { icon: <HeartHandshake size={18} />, name: "Nursing & Public Health" },
  { icon: <Users size={18} />, name: "Social Sciences" },
  { icon: <BarChart3 size={18} />, name: "IT & Computer Science" },
];

const WHY_US = [
  { icon: <ListChecks size={18} />, title: "Test selection you can defend", desc: "Every method is chosen against your actual research questions, never applied by default." },
  { icon: <ShieldCheck size={18} />, title: "Assumptions checked first", desc: "Normality, homogeneity, and linearity are reviewed before any result is interpreted." },
  { icon: <Table2 size={18} />, title: "APA formatting throughout", desc: "Tables and figures follow APA 7 style, ready to drop into Chapter 4." },
  { icon: <Award size={18} />, title: "Interpretation a committee can follow", desc: "Written so someone who has never opened SPSS can still follow the logic." },
  { icon: <Clock size={18} />, title: "Deadline-aware turnaround", desc: "Scope and timeline are agreed up front, before any analysis starts." },
];

// Illustrative examples of the kind of analysis we support, not claims about specific past clients.
const SAMPLE_PROJECTS = [
  { title: "Employee Turnover Study", field: "Business", question: "Do tenure and job satisfaction predict intent to leave?", approach: "Binary logistic regression with three predictors, assumptions checked for multicollinearity.", outcome: "Identified two significant predictors out of three tested." },
  { title: "Patient Wait-Time Analysis", field: "Nursing", question: "Does department affect patient wait time?", approach: "One-way ANOVA with Tukey post hoc comparisons.", outcome: "Found significant group differences, isolated to two of four departments." },
  { title: "Student Motivation Survey", field: "Education", question: "Is there a relationship between teacher feedback and motivation?", approach: "Pearson correlation plus reliability testing on the motivation scale.", outcome: "Moderate positive relationship, scale reliability confirmed at α = .84." },
];

const TESTIMONIALS = [
  { role: "PhD Candidate, Nursing", quote: "Add a real testimonial here once you have one you can attribute." },
  { role: "Master's Student, Business", quote: "Add a real testimonial here once you have one you can attribute." },
  { role: "Doctoral Student, Education", quote: "Add a real testimonial here once you have one you can attribute." },
];

const FAQS = [
  { q: "What is Chapter 4 data analysis, exactly?", a: "It's the process of turning your dissertation dataset into results: cleaning the data, running the correct statistical tests, checking assumptions, and writing up findings in a results chapter." },
  { q: "Can you tell me which SPSS test I need?", a: "Yes. Test selection is based on your research questions, hypotheses, variable types, and measurement levels; send those over and we'll confirm the right method." },
  { q: "Can you interpret SPSS output I've already generated?", a: "Yes. We can review existing output and interpret it in plain academic language tied directly to your research questions and hypotheses." },
  { q: "Do you provide APA-formatted tables?", a: "Yes, for descriptive statistics, reliability analysis, correlation, regression, t-tests, ANOVA, chi-square, and other common tests." },
  { q: "What affects the price?", a: "Dataset size, number of variables and tests, complexity of the analysis, your deadline, and whether you need full interpretation write-ups or tables only." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const CODE_SNIPPETS = {
  spss: `T-TEST GROUPS=group(1 2)
  /MISSING=ANALYSIS
  /VARIABLES=score
  /CRITERIA=CI(.95).`,
  r: `t.test(score ~ group, data = df,
       var.equal = TRUE)`,
  python: `from scipy import stats
stats.ttest_ind(group_a, group_b,
                 equal_var=True)`,
};

const PROCESS = [
  {
    title: "Send us your dissertation details",
    bullets: [
      "Share your topic, academic level, and deadline.",
      "Upload your dataset (SPSS, Excel, or CSV) or any output you already have.",
      "Note your university's formatting guidelines and any supervisor feedback.",
    ],
  },
  {
    title: "Work directly with your analyst",
    bullets: [
      "Agree on the exact scope: which tests, which chapters, which deliverables.",
      "Review draft output and ask questions as the analysis moves forward.",
      "Flag supervisor comments so they can be addressed before final delivery.",
    ],
  },
  {
    title: "Receive your finished analysis",
    bullets: [
      "Get your cleaned dataset, output, syntax, and APA 7 tables.",
      "Request adjustments within the agreed scope if anything needs clarifying.",
      "Use the interpretation notes to prepare for your defense or viva.",
    ],
  },
];

const TEST_SELECTION = [
  { q: "Describe the sample", m: "Frequencies, percentages, means, standard deviations" },
  { q: "Check whether a scale is reliable", m: "Cronbach's alpha" },
  { q: "Test a relationship between two continuous variables", m: "Pearson correlation" },
  { q: "Test a relationship with ordinal or non-normal data", m: "Spearman correlation" },
  { q: "Test association between two categorical variables", m: "Chi-square test" },
  { q: "Compare one group against a known value", m: "One-sample t-test" },
  { q: "Compare two independent groups", m: "Independent-samples t-test" },
  { q: "Compare the same group before and after", m: "Paired-samples t-test" },
  { q: "Compare three or more groups", m: "One-way ANOVA" },
  { q: "Compare groups while controlling for a covariate", m: "ANCOVA" },
  { q: "Predict a continuous outcome from several variables", m: "Multiple linear regression" },
  { q: "Predict a yes/no outcome", m: "Logistic regression" },
  { q: "Test whether survey items form valid factors", m: "Exploratory factor analysis" },
];

const DELIVERABLES = [
  { d: "Cleaned dataset", w: "Missing values, coding, and structure corrected and organized" },
  { d: "SPSS / R / Stata output", w: "Every test you asked for, organized and labeled" },
  { d: "Syntax file", w: "A record of exactly what was run, so it can be reproduced" },
  { d: "APA 7 tables", w: "Dissertation-ready tables instead of raw software screenshots" },
  { d: "Interpretation notes", w: "Plain-language explanation of what each result means" },
  { d: "Hypothesis decisions", w: "A clear supported / not supported statement for each hypothesis" },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const VIEWPORT = { once: false, amount: 0.2 };

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [testi, setTesti] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [expandedCase, setExpandedCase] = useState(null);
  const [activeField, setActiveField] = useState(0);
  const [codeTab, setCodeTab] = useState("spss");
  const [openFaq, setOpenFaq] = useState(0);
  const [counters, setCounters] = useState({ dissertations: 0, fields: 0, hours: 0 });

  const { text: typedHeadline, holding } = useTypewriter(ROTATING_WORDS);
  const counterRef = useRef(null);
  const isCounterInView = useInView(counterRef, { once: false, amount: 0.5 });

  useEffect(() => {
    const t = setInterval(() => setTesti((v) => (v + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setActiveField((v) => (v + 1) % FIELDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const h = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    if (!isCounterInView) return;
    // Placeholder figures, replace with your real numbers before launch.
    const targets = { dissertations: 240, fields: 6, hours: 24 };
    let step = 0;
    const steps = 60;
    const iv = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setCounters({
        dissertations: targets.dissertations * ease,
        fields: targets.fields * ease,
        hours: targets.hours * ease,
      });
      if (step >= steps) clearInterval(iv);
    }, 1200 / steps);
    return () => clearInterval(iv);
  }, [isCounterInView]);

  const anim = (variants) => (reduceMotion ? {} : { initial: "hidden", whileInView: "visible", viewport: VIEWPORT, variants });

  return (
    <div className={styles.page}>
      <SEO
        title="Chapter 4 Data Analysis Help | SPSS Dissertation Statistics"
        description="Chapter 4 dissertation data analysis help: SPSS statistical testing, assumption checks, APA tables, and plain-language results interpretation for graduate students."
        path="/"
        keywords="chapter 4 data analysis help, SPSS dissertation help, dissertation statistics help, thesis data analysis, dissertation results chapter help, quantitative dissertation help"
        jsonLd={faqJsonLd}
      />

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <motion.div className={styles.heroCopy} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
              <h1 className={styles.heroTitleRow}>
                <span className={styles.heroTitle}>Turn Your Data Into</span>
                <span className={styles.heroTitle}>
                  <span className={styles.typeText}>
                    {typedHeadline}
                    {!holding && <span className={styles.typeCaret}>|</span>}
                  </span>
                </span>
              </h1>
              <p className={styles.heroSub}>
                Dataset review, SPSS analysis, assumption checks, and APA tables
                for the results chapter of your thesis or dissertation. Whether
                you're staring at a blank Chapter 4 or a pile of SPSS output you
                don't know how to write up, we turn it into a results section your
                committee can follow, and one you can actually defend.
              </p>
              <div className={styles.heroBtnRow}>
                <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                  Start My Order <ArrowRight size={16} />
                </a>
                <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                  Get a Free Quote
                </a>
              </div>
              <div className={styles.trustRow}>
                {["APA 7", "SPSS", "R", "Stata"].map((b) => (
                  <span key={b} className={styles.trustBadge}>{b}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className={styles.heroImageCol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className={styles.heroImageBlob} aria-hidden="true" />
              <div className={styles.heroImageFrame}>
                <img
                  src="/organizing-dissertation-chapter-4-results-desk-hero.jpeg"
                  alt="A student organizing dissertation data, sticky-note themes, and a calculator on a desk while preparing a Chapter 4 results analysis"
                  className={styles.heroImage}
                  loading="eager"
                  width="900"
                  height="514"
                />
              </div>
              <div className={styles.heroFloatCard}>
                <span className={styles.heroFloatIcon}><CheckCircle2 size={16} /></span>
                <div>
                  <p className={styles.heroFloatTitle}>Assumptions checked</p>
                  <p className={styles.heroFloatSub}>before every result is interpreted</p>
                </div>
              </div>
              <div className={styles.heroBadgeCard}>
                <span className={styles.heroBadgeNum}>240+</span>
                <span className={styles.heroBadgeLabel}>dissertations supported</span>
              </div>
            </motion.div>
          </div>

          <motion.div className={styles.featureGrid} {...anim(stagger)}>
            {FEATURES.map((f) => (
              <motion.div key={f.key} variants={fadeUp}>
                <Link to="/services" className={styles.featureCard}>
                  <div className={styles.featureVisual}><f.Viz /></div>
                  <div className={styles.featureCardBody}>
                    <span className={styles.featureCardIcon}>{f.icon}</span>
                    <span className={styles.featureCardTitle}>{f.title}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ INTRO NARRATIVE ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.introWrap}>
            <p className={styles.secLabel}>Where students usually get stuck</p>
            <h2 className={styles.introTitle}>
              Chapter 4 isn't a writing problem. It's a statistics problem wearing a writing costume.
            </h2>
            <p className={styles.introPara}>
              By the time most graduate students reach their results chapter, the research design is
              locked, the survey has been distributed, and the data is sitting in a spreadsheet or an
              SPSS file waiting to be turned into something a committee can evaluate. The problem is
              rarely a lack of effort. It's that nobody walked you through how to choose between a
              Mann-Whitney U test and an independent-samples t-test, what to do when Levene's test
              comes back significant, or how a properly formatted APA 7 table is supposed to look once
              your software has spit out three pages of unformatted output.
            </p>
            <p className={styles.introPara}>
              SCAPE Data Solutions exists to close that gap. We work directly with your research
              questions and hypotheses, not a generic template, to clean your dataset, select the
              statistical or qualitative method that actually fits your variables and design, check the
              assumptions that make a test valid in the first place, and translate the output into plain
              academic language you can defend in front of a committee or an external examiner. You keep
              full ownership of the analysis and the write-up; we simply make sure the numbers are right
              and the reasoning behind them is something you can explain in your own words.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══ ORDER STRIP ═══ */}
      <section className={styles.container} style={{ padding: "2.5rem 1.5rem" }}>
        <div className={styles.orderStrip}>
          <div>
            <h2 className={styles.orderStripTitle}>Have your dataset ready?</h2>
            <p className={styles.orderStripSub}>Submit it through the client portal and we start scoping within one business day.</p>
          </div>
          <div className={styles.heroBtnRow}>
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>Submit a Project <ArrowRight size={16} /></a>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>Ask a Question First</a>
          </div>
        </div>
      </section>

      {/* ═══ SYNTAX PANEL ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.devGrid}>
            <div>
              <p className={styles.secLabel}>How the analysis actually runs</p>
              <h2 className={styles.secTitle}>Real syntax.<br />No black box.</h2>
              <p className={styles.devDesc}>
                Every test is documented so you can see exactly what was run and
                reproduce it yourself if your committee asks.
              </p>
              <div className={styles.devImageFrame}>
                <img
                  src="/images (2).jpeg"
                  alt="Statistical formulas and equations overlaid on a hand holding an open notebook, representing the math behind every test we run"
                  className={styles.devImage}
                  loading="lazy"
                  width="678"
                  height="452"
                />
              </div>
              <div className={styles.devStats}>
                <div><p className={styles.devStatNum}>3</p><p className={styles.devStatLabel}>Tools supported: SPSS, R, Python</p></div>
                <div><p className={styles.devStatNum}>APA 7</p><p className={styles.devStatLabel}>Table formatting standard</p></div>
              </div>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <span className={styles.codeDot} style={{ background: "#ff5f57" }} />
                <span className={styles.codeDot} style={{ background: "#febc2e" }} />
                <span className={styles.codeDot} style={{ background: "#28c840" }} />
              </div>
              <div className={styles.codeBody}>
                <pre className={styles.codePre}><code>{CODE_SNIPPETS[codeTab]}</code></pre>
              </div>
              <div className={styles.codeTabs}>
                {Object.keys(CODE_SNIPPETS).map((k) => (
                  <button key={k} className={`${styles.codeTab} ${codeTab === k ? styles.codeTabActive : ""}`} onClick={() => setCodeTab(k)}>
                    {k === "spss" ? "SPSS" : k === "r" ? "R" : "Python"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ STATS BAND ═══ */}
      <motion.section className={styles.statsBand} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.statsGrid} ref={counterRef}>
            <div>
              <span className={styles.statsNumber}>{Math.floor(counters.dissertations)}+</span>
              <p className={styles.statsLabel}>Dissertations Supported</p>
            </div>
            <div>
              <span className={styles.statsNumber}>{Math.floor(counters.fields)}</span>
              <p className={styles.statsLabel}>Research Fields Covered</p>
            </div>
            <div>
              <span className={styles.statsNumber}>{Math.floor(counters.hours)}h</span>
              <p className={styles.statsLabel}>Typical Response Time</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ SERVICES ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <h2 className={styles.secTitle}>What We Help With</h2>
            <p className={styles.secSubtitle}>
              From a messy spreadsheet to a finished results chapter. Each service below can stand
              alone. Order just the test you're stuck on, or combine several into a single engagement
              that takes your raw dataset all the way through to a submission-ready Chapter 4.
            </p>
          </div>
          <motion.ul className={styles.serviceList} {...anim(stagger)}>
            {SERVICES.map((svc) => (
              <motion.li key={svc.title} className={styles.serviceItem} variants={fadeUp}>
                <span className={styles.serviceIcon}>{svc.icon}</span>
                <div>
                  <h3 className={styles.serviceTitle}>{svc.title}</h3>
                  <p className={styles.serviceDesc}>{svc.desc}</p>
                  <ul className={styles.serviceTagsList}>
                    {svc.tags.map((tag) => <li key={tag} className={styles.serviceTagItem}>{tag}</li>)}
                  </ul>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.section>

      {/* ═══ SOFTWARE MARQUEE ═══ */}
      <section className={styles.sec}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <h2 className={styles.secTitle}>Software We Work In</h2>
            <p className={styles.secSubtitle}>
              We run the analysis in whatever your department, supervisor, or committee expects:
              SPSS syntax for a traditional stats course, R or Python if your program is moving that
              way, or Excel and Jamovi for a lighter-weight project. You'll always receive the syntax
              or script alongside the output, so the work can be reproduced or extended later.
            </p>
          </div>
        </div>
        <div className={styles.marqueeRow}>
          <div className={styles.marqueeTrack}>
            {SOFT_DUP.map((s, i) => (
              <div key={i} className={styles.techChip}>{s.name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FIELDS ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <h2 className={styles.secTitle}>Fields We Support</h2>
            <p className={styles.secSubtitle}>
              Statistical reasoning doesn't change much between disciplines, but the vocabulary,
              the expected reporting style, and the kinds of hypotheses a committee will push back
              on absolutely do. We've worked across the fields below enough to speak the language
              your department already uses.
            </p>
          </div>
          <div className={styles.devGrid}>
            <div className={styles.devImageFrame}>
              <img
                src="/images (1).jpeg"
                alt="Graduate students from different academic fields reviewing charts and printed data together"
                className={styles.devImage}
                loading="lazy"
                width="678"
                height="452"
              />
            </div>
            <ul className={styles.fieldList}>
              {FIELDS.map((f, i) => (
                <li
                  key={f.name}
                  className={`${styles.fieldItem} ${activeField === i ? styles.fieldItemActive : ""}`}
                  onClick={() => setActiveField(i)}
                >
                  <span className={styles.fieldIcon}>{f.icon}</span>
                  <span>{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ═══ WHY US ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <h2 className={styles.secTitle}>Why Students Work With Us</h2>
            <p className={styles.secSubtitle}>
              Anyone can run a test in SPSS and paste the output into a document. What actually gets
              a results chapter approved is choosing the right test in the first place, checking the
              assumptions behind it, and writing the interpretation so a non-specialist committee
              member can follow the logic. That's the part we focus on.
            </p>
          </div>
          <div className={styles.devGrid}>
            <div className={styles.devImageFrame}>
              <img
                src="/images.jpeg"
                alt="Close-up of a dissertation results chapter draft with statistical tables and handwritten notes"
                className={styles.devImage}
                loading="lazy"
                width="678"
                height="452"
              />
            </div>
            <dl className={styles.whyDefList}>
              {WHY_US.map((item) => (
                <div key={item.title} className={styles.whyDefRow}>
                  <dt className={styles.whyDefTerm}><span className={styles.whyDefIcon}>{item.icon}</span>{item.title}</dt>
                  <dd className={styles.whyDefDesc}>{item.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </motion.section>

      {/* ═══ SAMPLE PROJECTS ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <h2 className={styles.secTitle}>Examples of the Work We Do</h2>
            <p className={styles.secSubtitle}>Illustrative examples of typical Chapter 4 analyses, not specific past clients, meant to show the kind of question-to-method-to-outcome reasoning we bring to a real dataset.</p>
          </div>
          <div className={`${styles.heroImageFrame} ${styles.caseHeroImage}`}>
            <img
              src="/dissertation-chapter-examples.jpg"
              alt="Examples of dissertation chapter results laid out with charts and summary tables"
              className={styles.heroImage}
              loading="lazy"
              width="900"
              height="514"
            />
          </div>
          <div className={styles.caseList}>
            {SAMPLE_PROJECTS.map((s, i) => (
              <div key={s.title} className={styles.caseItem} onClick={() => setExpandedCase(expandedCase === i ? null : i)}>
                <div className={styles.caseHeader}>
                  <div>
                    <span className={styles.caseTitle}>{s.title}</span>
                    <span className={styles.caseField}>, {s.field}</span>
                  </div>
                  <ChevronDown size={16} style={{ transform: expandedCase === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </div>
                <AnimatePresence>
                  {expandedCase === i && (
                    <motion.div className={styles.caseBody} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <p><strong>Question:</strong> {s.question}</p>
                      <p><strong>Approach:</strong> {s.approach}</p>
                      <p><strong>Outcome:</strong> {s.outcome}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ TESTIMONIALS ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}><h2 className={styles.secTitle}>What Students Say</h2></div>
          <div className={styles.testiWrap}>
            <div className={styles.testiAvatarRow}>
              <img
                src="/writer.jpg"
                alt="A graduate student writing up their dissertation results"
                width="72"
                height="72"
                loading="lazy"
                className={styles.testiAvatar}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={testi} className={styles.testiCard} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                <div className={styles.stars}>{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#c9a227" color="#c9a227" />)}</div>
                <p className={styles.testiQ}>{TESTIMONIALS[testi].quote}</p>
                <p className={styles.testiRole}>{TESTIMONIALS[testi].role}</p>
              </motion.div>
            </AnimatePresence>
            <div className={styles.testiNav}>
              <button className={styles.testiBtn} onClick={() => setTesti((v) => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}><ChevronLeft size={16} /></button>
              <div className={styles.testiDots}>
                {TESTIMONIALS.map((_, i) => (
                  <span key={i} className={`${styles.tDot} ${i === testi ? styles.tDotOn : ""}`} onClick={() => setTesti(i)} />
                ))}
              </div>
              <button className={styles.testiBtn} onClick={() => setTesti((v) => (v + 1) % TESTIMONIALS.length)}><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ PROCESS ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <h2 className={styles.secTitle}>How It Works</h2>
            <p className={styles.secSubtitle}>Three steps from raw data to a finished results chapter. Each one is scoped and agreed with you before we start, so there are no surprises about what's included.</p>
          </div>
          <ol className={styles.processList}>
            {PROCESS.map((step, i) => (
              <li key={step.title} className={styles.processStep}>
                <span className={styles.processNum}>{i + 1}</span>
                <div>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                  <ul className={styles.processBullets}>
                    {step.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </motion.section>

      {/* ═══ TEST SELECTION ═══ */}
      <motion.section className={`${styles.sec} ${styles.secAlt}`} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <h2 className={styles.secTitle}>Which Test Do You Need?</h2>
            <p className={styles.secSubtitle}>The right method depends on your research question, hypothesis, and variable type.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Your research question</th><th>Suitable method</th></tr></thead>
              <tbody>
                {TEST_SELECTION.map((row) => (
                  <tr key={row.q}><td>{row.q}</td><td>{row.m}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* ═══ DELIVERABLES ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <h2 className={styles.secTitle}>What You Receive</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Deliverable</th><th>What it gives you</th></tr></thead>
              <tbody>
                {DELIVERABLES.map((row) => (
                  <tr key={row.d}><td><strong>{row.d}</strong></td><td>{row.w}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.confidentialBar}>
            <Lock size={16} />
            <span>Your dataset, topic, and files stay confidential, never resold, never reused.</span>
          </div>
        </div>
      </motion.section>

      {/* ═══ FAQ ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}><h2 className={styles.secTitle}>Common Questions</h2></div>
          <div className={styles.faqList}>
            {FAQS.map((item, i) => (
              <div key={item.q} className={styles.faqItem}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                  <span>{item.q}</span>
                  <ChevronDown size={18} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </button>
                <div className={styles.faqAnswer} style={{ maxHeight: openFaq === i ? "200px" : "0px" }}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ FINAL CTA ═══ */}
      <motion.section className={styles.finalCta} {...anim(fadeUp)}>
        <div className={`${styles.heroImageFrame} ${styles.ctaImageFrame}`}>
          <img
            src="/Untitled-design-16-1024x683.jpg"
            alt="A graduate celebrating after successfully defending their dissertation results"
            className={styles.heroImage}
            loading="lazy"
            width="1024"
            height="683"
          />
        </div>
        <h2>Ready to see what your data says?</h2>
        <p>Send your dataset, research questions, and deadline for a free quote.</p>
        <div className={styles.heroBtnRow} style={{ justifyContent: "center" }}>
          <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>Start My Order <ArrowRight size={16} /></a>
          <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondaryLight}>Contact Us</a>
        </div>
      </motion.section>

      <AnimatePresence>
        {showTop && (
          <motion.button
            className={styles.scrollTop}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}