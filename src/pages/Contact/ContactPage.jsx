import { Mail, Phone } from "lucide-react";
import SEO from "../../components/SEO/SEO";
import LandingContact from "../Landing/LandingContact";
import landing from "../Landing/LandingPage.module.css";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  return (
    <section className={styles.section}>
      <SEO
        title="Contact Us | Free Dissertation Data Analysis Quote"
        description="Send us your research questions, dataset, and deadline for a free quote on Chapter 4 statistical analysis and SPSS dissertation support."
        path="/contact"
        keywords="dissertation help contact, SPSS help quote, chapter 4 data analysis quote"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
      />
      <h1 className={styles.title}>Contact us</h1>
      <p className={styles.sub}>
        Send us your research questions, dataset, and deadline. We reply within 24 hours with a free quote.
      </p>
      <div className={styles.info}>
        <a href="mailto:info@scapedatasolutions.com"><Mail size={17} /> info@scapedatasolutions.com</a>
        <a href="tel:+17575980582"><Phone size={17} /> +1 (757) 598-0582</a>
      </div>
      <div className={`${landing.root} ${landing.th_brand}`}>
        <LandingContact />
      </div>
    </section>
  );
}
