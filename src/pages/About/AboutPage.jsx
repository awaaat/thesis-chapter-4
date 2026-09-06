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
      <h2 className={styles.title}>About Us</h2>
      <p className={styles.text}>
        ThesisDataAnalysis.com is a specialist offshoot of Scape Data Solutions,
        built specifically for graduate students who need reliable, accurate
        statistical support for their dissertation or thesis. We work across
        education, business, psychology, nursing, and social science research.
      </p>
    </section>
  );
}
