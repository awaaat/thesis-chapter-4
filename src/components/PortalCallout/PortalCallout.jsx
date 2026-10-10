import styles from "./PortalCallout.module.css";

// Rotating copy so the callout doesn't read as a copy-pasted template
// across every page. Pick a variant explicitly per page for control,
// or omit `variant` to get one based on a stable hash of the pathname.
const VARIANTS = [
  {
    text: <>Already a client? <strong>Track your projects, contracts, and payments</strong> in one place.</>,
    cta: "Visit the client portal",
  },
  {
    text: <>Curious what working with us looks like day-to-day? <strong>Take a look inside the client portal.</strong></>,
    cta: "Explore the portal",
  },
  {
    text: <>Existing projects and invoices live in your dedicated dashboard.</>,
    cta: "Open the client portal",
  },
  {
    text: <>We run every engagement through a shared portal &mdash; <strong>no email chains, no lost files</strong>.</>,
    cta: "See the portal",
  },
];

const PORTAL_URL = "https://portal.scapedatasolutions.com/";

export default function PortalCallout({ variant, inline = false, className = "" }) {
  const idx = typeof variant === "number" ? variant % VARIANTS.length : 0;
  const { text, cta } = VARIANTS[idx];

  if (inline) {
    return (
      <p className={`${styles.inline} ${className}`}>
        {text} <a href={PORTAL_URL}>{cta} →</a>
      </p>
    );
  }

  return (
    <div className={`${styles.callout} ${className}`}>
      <p className={styles.text}>{text}</p>
      <a href={PORTAL_URL} className={styles.link}>{cta} →</a>
    </div>
  );
}
