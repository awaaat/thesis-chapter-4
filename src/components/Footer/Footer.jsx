import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} ThesisDataAnalysis.com — A Scape Data Solutions company. All rights reserved.</p>
    </footer>
  );
}
