import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <section className={styles.section}>
      <SEO
        title="About Us | ThesisDataAnalysis.com"
        description="Specialist Chapter 4 and SPSS dissertation support for graduate students in education, business, psychology, nursing, and social science research."
        path="/about"
        keywords="dissertation statistics consultant, SPSS help for graduate students, thesis data analysis company"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
      />
      <h1 className={styles.title}>About ThesisDataAnalysis.com</h1>
      <p className={styles.lead}>
        ThesisDataAnalysis.com is the graduate-student arm of Scape Data Solutions, built for people who need
        reliable, accurate statistical support for a dissertation or thesis. We work across education, business,
        psychology, nursing, and social science research.
      </p>

      <h2 className={styles.h2}>What we do</h2>
      <p className={styles.text}>
        We take a research dataset and turn it into a results chapter: cleaning the data, choosing the test that fits
        each research question, checking assumptions, running the analysis in SPSS, R, Stata, Python or Excel, and
        reporting it in APA 7 tables with a plain-language interpretation.
      </p>

      <h2 className={styles.h2}>How we work</h2>
      <ul className={styles.list}>
        <li>The scope is agreed first: which tests, which chapters, which deliverables.</li>
        <li>You get a free quote before you pay anything.</li>
        <li>You receive the syntax along with the results, so every number can be reproduced.</li>
        <li>Your files stay confidential, and we make revisions to address supervisor feedback within the agreed scope.</li>
      </ul>

      <h2 className={styles.h2}>Start here</h2>
      <p className={styles.text}>
        Not sure what you need? <Link to="/contact">Send us your research questions and deadline</Link>, or browse{" "}
        <Link to="/data-analysis-services">our data analysis services</Link>.
      </p>
    </section>
  );
}
