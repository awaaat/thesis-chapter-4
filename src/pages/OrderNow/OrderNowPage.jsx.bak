import { Link } from "react-router-dom";
import { ExternalLink, Check } from "lucide-react";
import SEO from "../../components/SEO/SEO";
import styles from "./OrderNowPage.module.css";

const PORTAL_URL = "https://portal.scapedatasolutions.com/";
const READY = [
  "Your topic, academic level, and deadline",
  "Your dataset (SPSS, Excel, or CSV) or any output you already have",
  "Your university's formatting guidelines and any supervisor feedback",
];

export default function OrderNowPage() {
  return (
    <section className={styles.section}>
      <SEO
        title="Order Chapter 4 Data Analysis Help | Client Portal"
        description="Submit your dataset and place your order through our secure client portal. Track progress and message your analyst directly."
        path="/order-now"
        keywords="order dissertation data analysis, hire SPSS analyst, dissertation help order"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Order Now", path: "/order-now" }]}
      />
      <h1 className={styles.title}>Ready to get started?</h1>
      <p className={styles.sub}>
        Orders are placed and managed through our client portal, where you can upload your dataset, track progress,
        and message your analyst directly.
      </p>
      <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btn}>
        Go to the client portal <ExternalLink size={16} />
      </a>
      <p className={styles.note}>You'll be taken to {PORTAL_URL}</p>

      <div className={styles.ready}>
        <h2 className={styles.h2}>Have these ready</h2>
        <ul>{READY.map((r) => (<li key={r}><Check size={16} aria-hidden="true" />{r}</li>))}</ul>
        <p>Not ready to order? <Link to="/contact">Request a free quote first</Link>.</p>
      </div>
    </section>
  );
}
