import { ExternalLink } from "lucide-react";
import SEO from "../../components/SEO/SEO";
import styles from "./OrderNowPage.module.css";

const PORTAL_URL = "https://portal.scapedatasolutions.com/";

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
      <h2 className={styles.title}>Ready to Get Started?</h2>
      <p className={styles.sub}>
        Orders are placed and managed through our client portal, where you can
        upload your dataset, track progress, and message your analyst directly.
      </p>
      <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" className={styles.btn}>
        Go to Client Portal <ExternalLink size={16} />
      </a>
      <p className={styles.note}>You'll be redirected to {PORTAL_URL}</p>
    </section>
  );
}
