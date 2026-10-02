import { Mail } from "lucide-react";
import styles from "./Footer.module.css";

const EMAIL = "info@scapedatasolutions.com";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a href={`mailto:${EMAIL}`} className={styles.footerEmail}>
        <Mail size={18} />
        <span>{EMAIL}</span>
      </a>

      <p className={styles.footerNote}>
        © {new Date().getFullYear()} ThesisDataAnalysis.com — A Scape Data Solutions company. All rights reserved.
      </p>
    </footer>
  );
}