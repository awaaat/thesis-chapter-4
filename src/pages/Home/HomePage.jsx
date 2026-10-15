import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SEO from "../../components/SEO/SEO";
import { landingPages, CATEGORIES } from "../Landing/landingData";
import styles from "./HomePage.module.css";

const PORTAL_URL = "https://portal.scapedatasolutions.com/";
const EMAIL = "info@scapedatasolutions.com";

const INCLUDED = ["Cleaned dataset and syntax file", "Assumption checks before every test", "APA 7 tables and figures", "Plain-language interpretation"];
const SOFTWARE = ["SPSS", "R", "Python", "Stata", "Excel", "Jamovi"];

const SERVICES = [
  { title: "Dataset Review & Cleaning", desc: "Variable names, labels, coding, missing values, duplicates, and outliers, checked before any test runs.", tags: "Missing data · Duplicates · Outliers" },
  { title: "Test Selection", desc: "Each research question and hypothesis matched to the method that fits your variables and design.", tags: "Variable type · Group structure · Sample size" },
  { title: "SPSS, R & Stata Analysis", desc: "t-tests, ANOVA, regression, chi-square, reliability, and more, run accurately and documented clearly.", tags: "t-test · ANOVA · Regression" },
  { title: "Assumption Checks", desc: "Normality, homogeneity of variance, linearity, and multicollinearity, reviewed before interpretation.", tags: "Normality · Homogeneity · Linearity" },
  { title: "APA Tables & Figures", desc: "Clean, consistent, publication-ready tables for every test in your results chapter.", tags: "APA 7 · Tables · Figures" },
  { title: "Results Interpretation", desc: "Plain-language explanation of what your findings mean for each hypothesis, ready to defend.", tags: "Plain language · Defense-ready" },
];

const PROCESS = [
  { title: "Send us your dissertation details", bullets: ["Share your topic, academic level, and deadline.", "Upload your dataset (SPSS, Excel, or CSV) or any output you already have.", "Note your university's formatting guidelines and any supervisor feedback."] },
  { title: "Work directly with your analyst", bullets: ["Agree on the exact scope: which tests, which chapters, which deliverables.", "Review draft output and ask questions as the analysis moves forward.", "Flag supervisor comments so they can be addressed before final delivery."] },
  { title: "Receive your finished analysis", bullets: ["Get your cleaned dataset, output, syntax, and APA 7 tables.", "Request adjustments within the agreed scope if anything needs clarifying.", "Use the interpretation notes to prepare for your defense or viva."] },
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

// Illustrative examples of the kind of analysis we support, not claims about specific past clients.
const SAMPLE_PROJECTS = [
  { title: "Employee Turnover Study", field: "Business", question: "Do tenure and job satisfaction predict intent to leave?", approach: "Binary logistic regression with three predictors, assumptions checked for multicollinearity.", outcome: "Identified two significant predictors out of three tested." },
  { title: "Patient Wait-Time Analysis", field: "Nursing", question: "Does department affect patient wait time?", approach: "One-way ANOVA with Tukey post hoc comparisons.", outcome: "Found significant group differences, isolated to two of four departments." },
  { title: "Student Motivation Survey", field: "Education", question: "Is there a relationship between teacher feedback and motivation?", approach: "Pearson correlation plus reliability testing on the motivation scale.", outcome: "Moderate positive relationship, scale reliability confirmed at α = .84." },
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
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      <SEO
        title="Chapter 4 Data Analysis Help | SPSS Dissertation Statistics"
        description="Chapter 4 dissertation data analysis help: SPSS statistical testing, assumption checks, APA tables, and plain-language results interpretation for graduate students."
        path="/"
        keywords="chapter 4 data analysis help, SPSS dissertation help, dissertation statistics help, thesis data analysis, dissertation results chapter help, quantitative dissertation help"
        jsonLd={faqJsonLd}
      />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <h1 className={styles.h1}>Chapter 4 data analysis help for your thesis or dissertation</h1>
            <p className={styles.lead}>
              Dataset review, SPSS analysis, assumption checks, and APA tables for the results chapter of your
              thesis or dissertation. Whether you're staring at a blank Chapter 4 or a pile of SPSS output you
              don't know how to write up, we turn it into a results section your committee can follow, and one
              you can actually defend.
            </p>
            <div className={styles.btnRow}>
              <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                Start my order <ArrowRight size={16} />
              </a>
              <Link to="/contact" className={styles.btnOutline}>Get a free quote</Link>
            </div>
            <ul className={styles.ticks}>
              {INCLUDED.map((i) => (<li key={i}><Check size={16} aria-hidden="true" />{i}</li>))}
            </ul>
            <p className={styles.mailLine}>Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          </div>
          <img
            src="/organizing-dissertation-chapter-4-results-desk-hero.jpeg"
            alt="A student organizing dissertation data, sticky-note themes, and a calculator on a desk while preparing a Chapter 4 results analysis"
            className={styles.heroImg}
            loading="eager"
            width="900"
            height="514"
          />
        </div>
      </section>

      {/* SOFTWARE */}
      <div className={styles.strip}>
        <div className={styles.container}>
          <span>Software we work in:</span>
          {SOFTWARE.map((s) => (<b key={s}>{s}</b>))}
        </div>
      </div>

      {/* SERVICES */}
      <section className={styles.section}>
        <div className={styles.container}>
          <header className={styles.secHead}>
            <h2>What we do for your results chapter</h2>
            <p>Six steps that take a raw dataset to a Chapter 4 you can submit.</p>
          </header>
          <div className={styles.cards}>
            {SERVICES.map((s) => (
              <article key={s.title} className={styles.card}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <small>{s.tags}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <header className={styles.secHead}>
            <h2>How it works</h2>
            <p>Three steps, with the scope agreed before any analysis starts.</p>
          </header>
          <ol className={styles.steps}>
            {PROCESS.map((p, i) => (
              <li key={p.title}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3>{p.title}</h3>
                <ul>{p.bullets.map((b) => (<li key={b}>{b}</li>))}</ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TEST SELECTION */}
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.narrow}`}>
          <header className={styles.secHead}>
            <h2>Which statistical test do I need?</h2>
            <p>A starting point. The right choice also depends on your variable types, sample size and assumptions.</p>
          </header>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>If you need to…</th><th>A common method is</th></tr></thead>
              <tbody>
                {TEST_SELECTION.map((r) => (<tr key={r.q}><td>{r.q}</td><td>{r.m}</td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <header className={styles.secHead}>
            <h2>What you receive</h2>
            <p>Everything is organized so your supervisor can check it and you can reproduce it.</p>
          </header>
          <dl className={styles.deliver}>
            {DELIVERABLES.map((d) => (<div key={d.d}><dt>{d.d}</dt><dd>{d.w}</dd></div>))}
          </dl>
        </div>
      </section>

      {/* SAMPLES */}
      <section className={styles.section}>
        <div className={styles.container}>
          <header className={styles.secHead}>
            <h2>Examples of the analysis we support</h2>
            <p>Illustrative examples, not client data.</p>
          </header>
          <div className={styles.cards}>
            {SAMPLE_PROJECTS.map((s) => (
              <article key={s.title} className={styles.card}>
                <small className={styles.field}>{s.field}</small>
                <h3>{s.title}</h3>
                <p><strong>Question:</strong> {s.question}</p>
                <p><strong>Approach:</strong> {s.approach}</p>
                <p><strong>Result:</strong> {s.outcome}</p>
              </article>
            ))}
          </div>
          <p className={styles.fields}>
            We work across education, business and management, psychology, nursing and public health, social
            sciences, and IT and computer science.
          </p>
        </div>
      </section>

      {/* TOPIC LINKS */}
      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <header className={styles.secHead}>
            <h2>Get help with a specific problem</h2>
            <p>Each page explains the method, shows what the output looks like and ends with a free quote.</p>
          </header>
          <div className={styles.topics}>
            {CATEGORIES.map((c) => (
              <div key={c.id}>
                <h3>{c.title}</h3>
                <ul>
                  {landingPages.filter((p) => p.category === c.id).map((p) => (
                    <li key={p.slug}><Link to={`/${p.slug}`}>{p.short}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className={styles.fields}><Link to="/data-analysis-services">See all data analysis services →</Link></p>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.narrow}`}>
          <header className={styles.secHead}><h2>Frequently asked questions</h2></header>
          <div className={styles.faq}>
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>Send us your dataset and your deadline</h2>
          <p>We reply within 24 hours with a free quote, before you pay anything.</p>
          <div className={styles.btnRow} style={{ justifyContent: "center" }}>
            <Link to="/contact" className={styles.btnWhite}>Get a free quote</Link>
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>Start my order</a>
          </div>
        </div>
      </section>
    </div>
  );
}
