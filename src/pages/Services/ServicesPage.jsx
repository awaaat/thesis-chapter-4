// src/pages/Services/ServicesPage.jsx
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BarChart3, ShieldCheck, Table2, ChevronRight,
  TrendingUp, GitBranch, Layers, Network, Sparkles,
  CheckCircle, Users, Clock, Award,
} from "lucide-react";
import SEO from "../../components/SEO/SEO";
import styles from "./ServicesPage.module.css";
import {
  // New hero + process figures
  HeroDashboard,
  QuantProcessFigure,
  QualProcessFigure,
  MixedProcessFigure,
  SurveyProcessFigure,
  PowerProcessFigure,
  CleaningProcessFigure,
  WriteupProcessFigure,
  DecisionTreeFigure,
  DefenseProcessFigure,
  // Keep old icons for headers (or replace with new ones)
  IconQuant, IconQual, IconMixed, IconSurvey, IconPower, IconCleaning,
  IconWriteup, IconDecision, IconSoftware, IconScope, IconDefense, IconFAQ,
} from "./ServiceIllustrations";

const CONTACT_URL = "https://www.scapedatasolutions.com/contact";
const PORTAL_URL = "https://portal.scapedatasolutions.com/";
const SITE_URL = "https://www.scapedatasolutions.com";

/* ---------------------------------------------------------------- */
/* In-page navigation                                                */
/* ---------------------------------------------------------------- */
const CHIPS = [
  { id: "quant", label: "Quantitative Analysis" },
  { id: "qual", label: "Qualitative Analysis" },
  { id: "mixed", label: "Mixed Methods" },
  { id: "survey", label: "Survey Design" },
  { id: "power", label: "Sample Size & Power" },
  { id: "cleaning", label: "Data Cleaning" },
  { id: "writeup", label: "Results Write-Up" },
  { id: "software", label: "Software" },
  { id: "defense", label: "Defense Prep" },
];

/* ---------------------------------------------------------------- */
/* Quantitative analysis                                             */
/* ---------------------------------------------------------------- */
const QUANT_GROUPS = [
  {
    title: "Descriptive & Foundational Statistics",
    icon: <Table2 size={18} aria-hidden="true" />,
    items: [
      { name: "Descriptive statistics", desc: "Frequencies, percentages, means, medians, modes, standard deviations, ranges, and crosstabulations that summarize your sample before any test runs." },
      { name: "Assumption testing", desc: "Normality (Shapiro-Wilk, Kolmogorov-Smirnov, skewness/kurtosis), homogeneity of variance (Levene's test), linearity, multicollinearity (VIF/tolerance), homoscedasticity, and sphericity (Mauchly's test)." },
    ],
  },
  {
    title: "Comparing Groups",
    icon: <BarChart3 size={18} aria-hidden="true" />,
    items: [
      { name: "Parametric comparisons", desc: "One-sample, independent-samples, and paired-samples t-tests; one-way, two-way, and repeated-measures ANOVA; ANCOVA; MANOVA and MANCOVA for multiple dependent variables." },
      { name: "Non-parametric comparisons", desc: "Mann-Whitney U, Wilcoxon signed-rank, Kruskal-Wallis H, Friedman test, and the sign test for data that doesn't meet parametric assumptions." },
      { name: "Post hoc & pairwise tests", desc: "Tukey HSD, Bonferroni, Games-Howell, and Scheffé comparisons to pinpoint exactly which groups differ after a significant omnibus test." },
    ],
  },
  {
    title: "Relationships & Associations",
    icon: <GitBranch size={18} aria-hidden="true" />,
    items: [
      { name: "Correlation analysis", desc: "Pearson's r, Spearman's rho, Kendall's tau, and partial/semi-partial correlation for continuous, ordinal, and non-normal data." },
      { name: "Categorical associations", desc: "Chi-square test of independence, Fisher's exact test, Cramér's V, and the phi coefficient for relationships between categorical variables." },
    ],
  },
  {
    title: "Predictive & Explanatory Modeling",
    icon: <TrendingUp size={18} aria-hidden="true" />,
    items: [
      { name: "Linear regression", desc: "Simple, multiple, hierarchical, and stepwise regression to predict a continuous outcome from one or more predictors." },
      { name: "Logistic regression", desc: "Binary, multinomial, and ordinal logistic regression for categorical outcomes, with odds ratios and classification tables." },
      { name: "Moderation & mediation", desc: "Interaction effects and indirect-effect models using Hayes' PROCESS macro, including bootstrapped confidence intervals." },
    ],
  },
  {
    title: "Scale & Instrument Validation",
    icon: <ShieldCheck size={18} aria-hidden="true" />,
    items: [
      { name: "Reliability analysis", desc: "Cronbach's alpha, split-half reliability, and test-retest reliability for survey scales and instruments." },
      { name: "Factor analysis", desc: "Exploratory factor analysis (EFA) to uncover underlying structure, and confirmatory factor analysis (CFA) to test a hypothesized measurement model." },
    ],
  },
  {
    title: "Advanced & Multivariate Modeling",
    icon: <Network size={18} aria-hidden="true" />,
    items: [
      { name: "Structural equation modeling", desc: "Path analysis and full SEM in AMOS, Mplus, or R's lavaan package, including model fit indices (CFI, TLI, RMSEA, SRMR)." },
      { name: "Multilevel & hierarchical modeling", desc: "HLM / mixed-effects models for nested or clustered data, such as students within schools or patients within hospitals." },
      { name: "Cluster & discriminant analysis", desc: "K-means and hierarchical clustering to identify subgroups, plus discriminant analysis for group classification." },
    ],
  },
  {
    title: "Longitudinal & Time-Based Data",
    icon: <Layers size={18} aria-hidden="true" />,
    items: [
      { name: "Repeated measures & growth modeling", desc: "Tracking the same participants across multiple time points, including growth curve modeling." },
      { name: "Survival analysis", desc: "Kaplan-Meier curves and Cox proportional hazards regression for time-to-event data." },
      { name: "Time series analysis", desc: "Trend, seasonality, and autocorrelation analysis for data collected sequentially over time." },
    ],
  },
];

/* ---------------------------------------------------------------- */
/* Qualitative analysis                                              */
/* ---------------------------------------------------------------- */
const QUAL_ITEMS = [
  { name: "Thematic analysis", desc: "Braun & Clarke's six-phase approach: familiarization, coding, theme development, review, definition, and write-up." },
  { name: "Content analysis", desc: "Manifest and latent content coding with frequency counts across categories." },
  { name: "Grounded theory", desc: "Open, axial, and selective coding built toward a substantive theory grounded in your data." },
  { name: "Narrative analysis", desc: "Examining the structure, sequence, and meaning within participants' personal stories." },
  { name: "Case study analysis", desc: "Within-case and cross-case pattern analysis for single or multiple case designs." },
  { name: "Discourse analysis", desc: "How language, framing, and meaning-making function within text or transcripts." },
  { name: "Codebook development & interrater reliability", desc: "Shared coding frameworks with Cohen's kappa to check agreement between multiple coders." },
  { name: "Qualitative software support", desc: "NVivo, ATLAS.ti, Dedoose, and MAXQDA for coding, memoing, and theme visualization." },
];

/* ---------------------------------------------------------------- */
/* Mixed methods                                                     */
/* ---------------------------------------------------------------- */
const MIXED_ITEMS = [
  { name: "Convergent design", desc: "Quantitative and qualitative data collected in parallel, analyzed separately, then merged for comparison at the interpretation stage." },
  { name: "Explanatory sequential design", desc: "Quantitative results collected and analyzed first, then explained and enriched by a follow-up qualitative phase." },
  { name: "Exploratory sequential design", desc: "Qualitative findings collected first and used to build an instrument or framework that is then tested quantitatively." },
  { name: "Joint displays & integration", desc: "Side-by-side tables and visuals that show exactly where your quantitative and qualitative findings converge, diverge, or expand on one another." },
];

/* ---------------------------------------------------------------- */
/* Survey & instrument design: a genuine build sequence               */
/* ---------------------------------------------------------------- */
const SURVEY_STEPS = [
  { name: "Item development & scaling", desc: "Writing and structuring Likert-type, semantic differential, and multiple-choice items aligned to your constructs." },
  { name: "Content validity review", desc: "Expert panel feedback and content validity index (CVI) calculation before anything is fielded." },
  { name: "Pilot testing & pilot analysis", desc: "Small-sample data collection and analysis to catch wording, scaling, or logic problems before your full launch." },
  { name: "Reliability & validity testing", desc: "Cronbach's alpha, factor structure, and convergent/discriminant validity on your finalized instrument." },
  { name: "Platform setup guidance", desc: "Building your survey correctly in Qualtrics, SurveyMonkey, REDCap, or Google Forms, ready for distribution." },
];

/* ---------------------------------------------------------------- */
/* Sample size & power                                               */
/* ---------------------------------------------------------------- */
const POWER_ITEMS = [
  { name: "A priori power analysis", desc: "G*Power calculations to determine the minimum sample size you need before you collect data." },
  { name: "Post hoc power analysis", desc: "Power calculations for studies where sample size was already fixed in advance." },
  { name: "Effect size selection", desc: "Choosing and defending Cohen's d, f², eta-squared, or odds ratios for your specific design." },
  { name: "Sample size for advanced designs", desc: "SEM, multilevel models, and multivariate designs, where standard calculators fall short." },
];

/* ---------------------------------------------------------------- */
/* Data cleaning: a genuine processing sequence                      */
/* ---------------------------------------------------------------- */
const CLEANING_STEPS = [
  { name: "Data entry & digitization", desc: "Converting paper surveys or scattered files into one clean, structured dataset." },
  { name: "Missing data handling", desc: "Listwise/pairwise deletion, mean substitution, or multiple imputation, chosen based on why your data is missing." },
  { name: "Outlier detection", desc: "Z-scores, boxplots, and Mahalanobis distance to flag and evaluate unusual cases." },
  { name: "Variable recoding & computing", desc: "Reverse-scoring, composite variables, dummy coding, and categorical recoding." },
  { name: "Restructuring data", desc: "Reshaping between wide and long formats for repeated-measures or longitudinal analysis." },
];

/* ---------------------------------------------------------------- */
/* Interpretation & write-up                                         */
/* ---------------------------------------------------------------- */
const WRITEUP_ITEMS = [
  { name: "APA 7 tables & figures", desc: "Every table and chart formatted to APA 7 standard, ready to paste into your document." },
  { name: "Hypothesis-by-hypothesis interpretation", desc: "A clear supported / not supported statement tied directly to each research question." },
  { name: "Full Chapter 4 drafting", desc: "A complete results narrative connecting your analysis to your research questions, not just raw output." },
  { name: "Chapter 5 alignment", desc: "Making sure your discussion chapter's claims are actually backed by what Chapter 4 found." },
];

/* ---------------------------------------------------------------- */
/* Software                                                           */
/* ---------------------------------------------------------------- */
const SOFTWARE_TABLE = [
  { name: "SPSS", best: "Most common in social science & applied dissertations", use: "Descriptive and inferential statistics with menu-driven, well-documented output" },
  { name: "R", best: "Flexible, free, publication-quality graphics", use: "Advanced modeling, SEM (lavaan), and fully custom or reproducible analysis" },
  { name: "Python", best: "Larger or messier datasets", use: "Data wrangling, automation, and machine-learning-adjacent analysis" },
  { name: "Stata", best: "Economics, public health, panel data", use: "Regression, survival analysis, and panel/longitudinal models" },
  { name: "AMOS", best: "SEM specifically, common in education & psychology", use: "Path diagrams and structural equation modeling" },
  { name: "Mplus", best: "Advanced latent-variable modeling", use: "Complex multilevel, latent class, and mixture models" },
  { name: "Jamovi / JASP", best: "A free, SPSS-like interface", use: "Quick analyses, including Bayesian options" },
  { name: "NVivo / ATLAS.ti", best: "Qualitative research", use: "Coding, memoing, and organizing qualitative or mixed-methods data" },
];

/* ---------------------------------------------------------------- */
/* Decision tree (visual branching, not a table)                    */
/* ---------------------------------------------------------------- */
const DECISION_TREE = [
  {
    question: "What do you want to do?",
    branches: [
      {
        label: "Describe my sample",
        method: "Descriptive statistics (frequencies, M, SD)",
      },
      {
        label: "Compare groups",
        method: "t-tests, ANOVA, or non-parametric alternatives",
        sub: [
          { label: "Two independent groups", method: "Independent-samples t-test" },
          { label: "Two related groups (before/after)", method: "Paired-samples t-test" },
          { label: "Three or more groups", method: "One-way ANOVA" },
          { label: "Three or more groups, non-normal", method: "Kruskal-Wallis H" },
          { label: "Comparing groups with a covariate", method: "ANCOVA" },
        ],
      },
      {
        label: "Test a relationship",
        method: "Correlation or chi-square",
        sub: [
          { label: "Two continuous variables", method: "Pearson correlation" },
          { label: "Ordinal or non-normal data", method: "Spearman correlation" },
          { label: "Two categorical variables", method: "Chi-square test" },
        ],
      },
      {
        label: "Predict an outcome",
        method: "Regression models",
        sub: [
          { label: "Continuous outcome", method: "Multiple linear regression" },
          { label: "Binary (yes/no) outcome", method: "Binary logistic regression" },
          { label: "Categorical (3+ categories)", method: "Multinomial logistic regression" },
          { label: "Time-to-event", method: "Survival analysis / Cox regression" },
        ],
      },
      {
        label: "Check reliability or validity",
        method: "Cronbach's alpha or factor analysis",
        sub: [
          { label: "Reliability of a scale", method: "Cronbach's alpha" },
          { label: "Underlying factor structure", method: "Exploratory factor analysis" },
          { label: "Test a hypothesized model", method: "Confirmatory factor analysis" },
        ],
      },
    ],
  },
];

/* ---------------------------------------------------------------- */
/* Engagement scope                                                  */
/* ---------------------------------------------------------------- */
const SCOPES = [
  {
    title: "Analysis & Output",
    desc: "Every test run in your software of choice. Best if you plan to interpret and write up results yourself.",
    includes: ["Raw output for every requested test", "Syntax file for reproducibility", "Cleaned, organized dataset"],
  },
  {
    title: "Analysis + APA Tables & Interpretation",
    desc: "Everything above, plus formatted tables and plain-language interpretation. Covers most Chapter 4 needs.",
    includes: ["Everything in Analysis & Output", "APA 7 tables and figures", "Hypothesis-by-hypothesis interpretation notes"],
    featured: true,
  },
  {
    title: "Full Chapter 4 Support",
    desc: "A complete, narrative results chapter formatted to your program's guidelines, plus defense prep.",
    includes: ["Everything in the tier above", "Full results narrative draft", "Revisions within agreed scope", "Defense/viva prep notes"],
  },
];

/* ---------------------------------------------------------------- */
/* Defense prep: presented as a preparation sequence                 */
/* ---------------------------------------------------------------- */
const DEFENSE_STEPS = [
  { name: "Mock Q&A on your results", desc: "We ask the questions your committee is likely to ask, based on your specific findings, not a generic bank of questions." },
  { name: "Plain-language explanations", desc: "For every statistical choice you made, in language you can say out loud with confidence, no matter how technical the method." },
  { name: "A one-page methods summary", desc: "A quick-reference sheet covering your design, tests, and key findings, built to glance at mid-defense." },
  { name: "Anticipating pushback", desc: "Preparing answers on assumptions, sample size, and effect sizes before your committee asks." },
];

/* ---------------------------------------------------------------- */
/* FAQ                                                                */
/* ---------------------------------------------------------------- */
const FAQS = [
  { q: "Do you only work in SPSS?", a: "No, we also work in R, Python, Stata, AMOS, Mplus, and Jamovi. Tell us your university's preferred software (or your advisor's) and we'll match it." },
  { q: "Can you run SEM or CFA for my dissertation?", a: "Yes. We build and test measurement and structural models in AMOS, Mplus, or R's lavaan package, and report the fit indices (CFI, TLI, RMSEA, SRMR) your committee will expect." },
  { q: "I already have qualitative interview data. Can you help with coding?", a: "Yes. We can develop a codebook, apply thematic or content analysis, check interrater reliability across multiple coders, and organize everything in NVivo or ATLAS.ti." },
  { q: "Can you tell me how many participants I need before I collect data?", a: "Yes, that's an a priori power analysis. Send your planned design (test type, expected effect size, alpha level) and we'll calculate the minimum sample size and explain how we got there." },
  { q: "What if my data doesn't meet the assumptions for the test I wanted to run?", a: "We check assumptions first. If they're violated, we recommend and run the appropriate non-parametric alternative or a robust correction, and explain the substitution in your write-up." },
  { q: "Do you write the actual results chapter, or just hand me output?", a: "Both options are available: raw output and tables only, or a full narrative Chapter 4 draft connecting each test back to your research questions. See the engagement options above." },
  { q: "Can you help me prepare for my defense?", a: "Yes. We put together plain-language explanations for every statistical decision you made and run through likely committee questions before your defense or viva." },
  { q: "How do you handle missing data?", a: "It depends on how much is missing and why. We'll walk through listwise deletion, mean substitution, or multiple imputation, and pick, and justify, the method that fits your dataset and design." },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };

/* ---------------------------------------------------------------- */
/* Reusable semantic blocks                                          */
/* ---------------------------------------------------------------- */

function TermList({ items }) {
  return (
    <dl className={styles.termList}>
      {items.map((it) => (
        <div className={styles.termRow} key={it.name}>
          <dt className={styles.termName}>{it.name}</dt>
          <dd className={styles.termDesc}>{it.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

function StepList({ items }) {
  return (
    <ol className={styles.stepList}>
      {items.map((it, i) => (
        <li className={styles.stepItem} key={it.name}>
          <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
          <div>
            <p className={styles.stepName}>{it.name}</p>
            <p className={styles.stepDesc}>{it.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items }) {
  return (
    <ul className={styles.bulletList}>
      {items.map((it) => (
        <li className={styles.bulletItem} key={it.name}>
          <span className={styles.bulletName}>{it.name}</span>
          <span className={styles.bulletDesc}>{it.desc}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  const reduceMotion = useReducedMotion();
  const anim = (variants) => (reduceMotion ? {} : { initial: "hidden", animate: "visible", variants });

  /* JSON-LD structured data: Service + FAQPage + BreadcrumbList + Review */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "name": "SCAPE Data Solutions Statistical Analysis Services",
        "url": `${SITE_URL}/services`,
        "description": "Quantitative, qualitative, and mixed-methods data analysis for dissertations and theses, including SPSS, R, Python, Stata, AMOS, and Mplus support, survey design, power analysis, data cleaning, APA 7 tables, and defense preparation.",
        "priceRange": "$$",
        "areaServed": { "@type": "Country", "name": "United States" },
        "provider": { "@type": "Organization", "name": "SCAPE Data Solutions", "url": SITE_URL },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Statistical analysis services",
          "itemListElement": [
            "Quantitative data analysis", "Qualitative data analysis", "Mixed methods analysis",
            "Survey and instrument design", "Sample size and power analysis", "Data cleaning and management",
            "Results interpretation and write-up", "Dissertation defense preparation",
          ].map((name) => ({ "@type": "Offer", "itemOffered": { "@type": "Service", name } })),
        },
        "review": {
          "@type": "Review",
          "reviewRating": { "@type": "Rating", "ratingValue": "4.9", "bestRating": "5" },
          "author": { "@type": "Person", "name": "PhD Candidate" },
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        ],
      },
    ],
  };

  return (
    <div className={styles.page}>
      <SEO
        title="Dissertation Statistics Services | SPSS, R & Qualitative Data Analysis"
        description="Expert dissertation statistics help: SPSS, R, Python, Stata, AMOS & Mplus analysis. Qualitative coding, mixed methods, G*Power sample size, APA 7 results chapters & defense prep. Trusted by PhD students worldwide."
        path="/services"
        keywords="dissertation statistics help, SPSS analysis service, qualitative data analysis service, mixed methods dissertation, SEM AMOS help, power analysis G*Power, APA results chapter writing, thesis data analysis, statistical consultant for dissertation"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]}
      />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* ═══ BREADCRUMB ═══ */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li><a href="/">Home</a></li>
          <li aria-hidden="true"><ChevronRight size={13} /></li>
          <li aria-current="page">Services</li>
        </ol>
      </nav>

      {/* ═══ HERO ═══ */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1 className={styles.heroTitle}>Statistical analysis services for dissertations and theses</h1>
              <p className={styles.heroSub}>
                From a first crosstab to a full structural equation model, SCAPE Data Solutions
                provides quantitative, qualitative, and mixed-methods analysis in the exact
                software your committee expects: SPSS, R, Python, Stata, AMOS, or Mplus.
              </p>
              <p className={styles.heroSub}>
                Every engagement starts with your research questions and hypotheses, not a
                default checklist: we choose methods that your data can actually support, then
                document every decision so it can be defended in front of a committee.
              </p>
              <div className={styles.heroBtnRow}>
                <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                  Start My Order <ArrowRight size={16} />
                </a>
                <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                  Ask About My Study
                </a>
              </div>

              <dl className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <dt>40+</dt>
                  <dd>statistical &amp; qualitative methods covered</dd>
                </div>
                <div className={styles.heroStat}>
                  <dt>8</dt>
                  <dd>software platforms supported</dd>
                </div>
                <div className={styles.heroStat}>
                  <dt>3</dt>
                  <dd>engagement tiers, from output-only to full write-up</dd>
                </div>
              </dl>
            </div>

            <figure className={styles.heroFigure}>
              <div className={styles.heroImageBlob} aria-hidden="true" />
              <div className={styles.heroImageFrame}>
                <img
                  src="/dissertation-chapter-examples.jpg"
                  alt="Stacks of academic books and a hand annotating a dissertation chapter with a pen, representing careful statistical analysis and results write-up"
                  className={styles.heroImage}
                  loading="eager"
                  width="900"
                  height="514"
                />
              </div>
              <div className={styles.heroDashboardChip}>
                <HeroDashboard />
              </div>
              <figcaption className={styles.heroFigcaption}>
                We turn raw output into publication‑ready APA 7 tables and narratives.
              </figcaption>
            </figure>
          </div>

          <nav className={styles.chipRow} aria-label="Jump to a service section">
            {CHIPS.map((c) => (
              <a key={c.id} href={`#${c.id}`} className={styles.chip}>{c.label}</a>
            ))}
          </nav>
        </div>
      </header>

      {/* ═══ QUICK ANSWER (AI‑friendly) ═══ */}
      <section className={styles.quickAnswer}>
        <div className={styles.container}>
          <h2 className={styles.quickAnswerTitle}>Quick answer: what statistics help do you provide?</h2>
          <p className={styles.quickAnswerText}>
            SCAPE Data Solutions provides comprehensive dissertation and thesis statistics help across
            quantitative (SPSS, R, Python, Stata, AMOS, Mplus), qualitative (NVivo, ATLAS.ti, thematic analysis),
            and mixed-methods approaches. We handle everything from G*Power sample size calculation to
            APA 7 results chapter writing and defense preparation.
          </p>
        </div>
      </section>

      {/* ═══ CHAPTER MAP STRIP ═══ */}
      <section className={styles.sec} style={{ paddingTop: 0 }}>
        <div className={styles.container}>
          <div className={styles.mapStrip}>
            <div className={styles.mapStripImageFrame}>
              <img
                src="/images.jpeg"
                alt="A dissertation chapter outline on a laptop screen, showing Introduction, Literature Review, Research Methodology, Results and Analysis, Discussion, and Conclusion, next to annotated notes"
                className={styles.mapStripImage}
                loading="lazy"
                width="447"
                height="447"
              />
            </div>
            <div>
              <p className={styles.secLabel}>Before we touch your data</p>
              <h2 className={styles.mapStripTitle}>We map every chapter first.</h2>
              <p className={styles.mapStripDesc}>
                We start by seeing where the analysis fits into the full document: introduction,
                literature review, methodology, results, and discussion. That way, the tests we
                run and the tables we build answer the exact hypotheses your committee expects,
                not a generic checklist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUANTITATIVE ═══ */}
      <motion.section id="quant" className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconQuant /></span>
            <h2 className={styles.secTitle}>Quantitative Data Analysis for Dissertations: SPSS, R &amp; Stata</h2>
          </div>
          <div className={styles.proseCol}>
            <p className={styles.prose}>
              Quantitative dissertation analysis covers everything from a simple crosstab to a
              full structural equation model. We match the method to your research questions,
              hypotheses, and variable types. The list below is organized the way a committee
              reads a methodology chapter: description first, then comparison, association,
              prediction, measurement, and finally the advanced and longitudinal designs.
            </p>
          </div>

          <QuantProcessFigure className={styles.spotFigure} />

          <div className={styles.catList}>
            {QUANT_GROUPS.map((group) => (
              <article key={group.title} className={styles.catBlock}>
                <div className={styles.catHead}>
                  <span className={styles.catIcon}>{group.icon}</span>
                  <h3 className={styles.catTitle}>{group.title}</h3>
                </div>
                <TermList items={group.items} />
              </article>
            ))}
          </div>

          <blockquote className={styles.pullquote}>
            The right test is not the most advanced one available. It is the one your research
            question and data actually require. Everything else is an assumption your committee
            can challenge.
          </blockquote>
        </div>
      </motion.section>

      {/* ═══ QUALITATIVE ═══ */}
      <motion.section id="qual" className={`${styles.sec} ${styles.secAlt}`} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconQual /></span>
            <h2 className={styles.secTitle}>Qualitative Data Analysis Services: Thematic &amp; Content Analysis</h2>
          </div>
          <div className={styles.proseCol}>
            <p className={styles.prose}>
              Qualitative dissertation support covers coding and interpretation for interview
              transcripts, open-ended survey responses, focus groups, and documents. We build a
              codebook around your conceptual framework rather than a generic template, and check
              agreement across coders wherever your design calls for it.
            </p>
          </div>

          <QualProcessFigure className={styles.spotFigure} />
          <BulletList items={QUAL_ITEMS} />
        </div>
      </motion.section>

      {/* ═══ MIXED METHODS ═══ */}
      <motion.section id="mixed" className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconMixed /></span>
            <h2 className={styles.secTitle}>Mixed Methods Dissertation Analysis: Convergent &amp; Sequential Designs</h2>
          </div>
          <div className={styles.proseCol}>
            <p className={styles.prose}>
              A mixed-methods dissertation only works when the quantitative and qualitative
              strands are designed to speak to each other from the start, not analyzed separately
              and stitched together at the end. We support all three core designs:
            </p>
          </div>
          <MixedProcessFigure className={styles.spotFigure} />
          <div className={styles.miniArticles}>
            {MIXED_ITEMS.map((it) => (
              <article key={it.name} className={styles.miniArticle}>
                <h4 className={styles.miniArticleTitle}>{it.name}</h4>
                <p className={styles.miniArticleDesc}>{it.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ SURVEY DESIGN ═══ */}
      <motion.section id="survey" className={`${styles.sec} ${styles.secAlt}`} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconSurvey /></span>
            <h2 className={styles.secTitle}>Survey Design &amp; Instrument Validation: From Draft to Reliability Testing</h2>
          </div>
          <div className={styles.proseCol}>
            <p className={styles.prose}>
              A survey instrument is validated before a single response comes in, not after. We
              typically move through the same five stages, in order:
            </p>
          </div>

          <SurveyProcessFigure className={styles.spotFigure} />
          <StepList items={SURVEY_STEPS} />
        </div>
      </motion.section>

      {/* ═══ SAMPLE SIZE & POWER ═══ */}
      <motion.section id="power" className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconPower /></span>
            <h2 className={styles.secTitle}>G*Power Sample Size Calculation: A Priori &amp; Post Hoc Power Analysis</h2>
          </div>
          <div className={styles.proseCol}>
            <p className={styles.prose}>
              Your methodology chapter needs a defensible number, with a calculation behind it,
              not a round figure picked because it sounded reasonable.
            </p>
          </div>

          <PowerProcessFigure className={styles.spotFigure} />
          <BulletList items={POWER_ITEMS} />
        </div>
      </motion.section>

      {/* ═══ DATA CLEANING ═══ */}
      <motion.section id="cleaning" className={`${styles.sec} ${styles.secAlt}`} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconCleaning /></span>
            <h2 className={styles.secTitle}>Data Management &amp; Cleaning for Dissertation Research</h2>
          </div>
          <div className={styles.proseCol}>
            <p className={styles.prose}>
              This is the unglamorous work that determines whether every test after it can be
              trusted. We usually work through it in this order:
            </p>
          </div>

          <CleaningProcessFigure className={styles.spotFigure} />
          <StepList items={CLEANING_STEPS} />
        </div>
      </motion.section>

      {/* ═══ INTERPRETATION & WRITE-UP ═══ */}
      <motion.section id="writeup" className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconWriteup /></span>
            <h2 className={styles.secTitle}>APA 7 Results Chapter Writing &amp; Interpretation</h2>
          </div>
          <div className={styles.proseCol}>
            <p className={styles.prose}>
              Statistical output is not a results chapter. Turning SPSS or R printouts into
              language a committee can follow, and that supports your discussion chapter's
              claims, is its own skill:
            </p>
          </div>

          <WriteupProcessFigure className={styles.spotFigure} />
          <BulletList items={WRITEUP_ITEMS} />
        </div>
      </motion.section>

      <hr className={styles.divider} />

      {/* ═══ DECISION TREE (visual) ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconDecision /></span>
            <h2 className={styles.secTitle}>Which Statistical Method Do You Need? A Visual Decision Tree</h2>
            <p className={styles.secSubtitle}>The right method follows from your research question and your data, not the other way around.</p>
          </div>

          <DecisionTreeFigure className={styles.spotFigure} />

          <div className={styles.decisionTree}>
            {DECISION_TREE.map((branch) => (
              <div key="root" className={styles.treeRoot}>
                <div className={styles.treeNode}>{branch.question}</div>
                <div className={styles.treeBranches}>
                  {branch.branches.map((b, idx) => (
                    <div key={idx} className={styles.treeBranch}>
                      <div className={styles.treeMethod}>{b.label} → <strong>{b.method}</strong></div>
                      {b.sub && (
                        <ul className={styles.treeSub}>
                          {b.sub.map((s, i) => (
                            <li key={i}>{s.label} → {s.method}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ SOFTWARE ═══ */}
      <motion.section id="software" className={`${styles.sec} ${styles.secAlt}`} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconSoftware /></span>
            <h2 className={styles.secTitle}>Software We Work In: SPSS, R, Python, Stata, AMOS, Mplus &amp; More</h2>
            <p className={styles.secSubtitle}>We match your university's required tool, or recommend one if you haven't picked yet.</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className={styles.tableCaption}>Statistical and qualitative software platforms supported, with typical use cases</caption>
              <thead><tr><th scope="col">Software</th><th scope="col">Best for</th><th scope="col">Typical use here</th></tr></thead>
              <tbody>
                {SOFTWARE_TABLE.map((row) => (
                  <tr key={row.name}><th scope="row">{row.name}</th><td>{row.best}</td><td>{row.use}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* ═══ SCOPE / ENGAGEMENT TIERS ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconScope /></span>
            <h2 className={styles.secTitle}>What's Included: Three Engagement Tiers</h2>
            <p className={styles.secSubtitle}>Three ways to work with us, depending on how much of the write-up you want to do yourself.</p>
          </div>

          <motion.div className={styles.scopeGrid} {...anim(stagger)}>
            {SCOPES.map((s) => (
              <motion.article key={s.title} variants={fadeUp} className={`${styles.scopeCard} ${s.featured ? styles.scopeCardFeatured : ""}`}>
                {s.featured && <p className={styles.scopeBadge}>Most common</p>}
                <h3 className={styles.scopeTitle}>{s.title}</h3>
                <p className={styles.scopeDesc}>{s.desc}</p>
                <ul className={styles.scopeList}>
                  {s.includes.map((inc) => (
                    <li key={inc}>{inc}</li>
                  ))}
                </ul>
                <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={s.featured ? styles.btnPrimary : styles.btnSecondary}>
                  Ask About This Option
                </a>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ DEFENSE PREP ═══ */}
      <motion.section id="defense" className={`${styles.sec} ${styles.secAlt}`} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconDefense /></span>
            <h2 className={styles.secTitle}>Dissertation Defense &amp; Viva Preparation</h2>
            <p className={styles.secSubtitle}>Running the numbers is one thing. Explaining them under questioning is another. We prepare you in four stages:</p>
          </div>

          <DefenseProcessFigure className={styles.spotFigure} />
          <StepList items={DEFENSE_STEPS} />
        </div>
      </motion.section>

      {/* ═══ WHO WE HELP / WHY CHOOSE US ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><Users size={30} /></span>
            <h2 className={styles.secTitle}>Who We Help &amp; Why Choose SCAPE</h2>
          </div>
          <div className={styles.twoCol}>
            <div>
              <h3>We support:</h3>
              <ul className={styles.iconList}>
                <li><CheckCircle size={18} /> PhD candidates</li>
                <li><CheckCircle size={18} /> Master's students</li>
                <li><CheckCircle size={18} /> Faculty researchers</li>
                <li><CheckCircle size={18} /> Clinical &amp; public health researchers</li>
              </ul>
            </div>
            <div>
              <h3>Why SCAPE?</h3>
              <ul className={styles.iconList}>
                <li><Award size={18} /> PhD‑level statisticians</li>
                <li><Clock size={18} /> Reliable turnaround &amp; revisions</li>
                <li><ShieldCheck size={18} /> Confidentiality guaranteed</li>
                <li><TrendingUp size={18} /> Focus on defendable results</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ FAQ ═══ */}
      <motion.section className={styles.sec} {...anim(fadeUp)}>
        <div className={styles.container}>
          <div className={styles.secHead}>
            <span className={styles.secIcon}><IconFAQ /></span>
            <h2 className={styles.secTitle}>Common Questions</h2>
          </div>
          <div className={styles.faqList}>
            {FAQS.map((item) => (
              <details key={item.q} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.q}</summary>
                <p className={styles.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ FINAL CTA ═══ */}
      <motion.section className={styles.finalCta} {...anim(fadeUp)}>
        <Sparkles size={22} className={styles.finalCtaIcon} aria-hidden="true" />
        <h2>Not sure which service you need?</h2>
        <p>Send your research questions and any data you already have, and we'll tell you exactly what's involved.</p>
        <div className={styles.heroBtnRow} style={{ justifyContent: "center" }}>
          <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>Start My Order <ArrowRight size={16} /></a>
          <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondaryLight}>Contact Us</a>
        </div>
      </motion.section>
    </div>
  );
}