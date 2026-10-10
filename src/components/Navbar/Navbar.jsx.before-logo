import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Mail } from "lucide-react";
import styles from "./Navbar.module.css";

// This site is a child of scapedatasolutions.com. Only Home and Services
// are unique here — About and Contact route back to the parent site's
// contact page rather than duplicating content this site doesn't own.
const PARENT_CONTACT_URL = "https://www.scapedatasolutions.com/contact";
const EMAIL = "info@scapedatasolutions.com";

export default function Navbar({ activeNav = "" }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", key: "home", internal: true },
    { to: "/services", label: "Services", key: "services", internal: true },
    { to: PARENT_CONTACT_URL, label: "About", key: "about", internal: false },
    { to: PARENT_CONTACT_URL, label: "Contact", key: "contact", internal: false },
  ];

  // Close the mobile panel whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          Scape Data Solutions
        </Link>

        <nav className={styles.nav}>
          {links.map((l) =>
            l.internal ? (
              <Link
                key={l.key}
                to={l.to}
                className={`${styles.link}${activeNav === l.key ? " " + styles.linkActive : ""}`}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.key}
                href={l.to}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.link}${activeNav === l.key ? " " + styles.linkActive : ""}`}
              >
                {l.label}
              </a>
            )
          )}

          <a href={`mailto:${EMAIL}`} className={styles.emailLink}>
            <Mail size={15} />
            {EMAIL}
          </a>

          <Link to="/order-now" className={styles.cta}>Order Now</Link>
        </nav>

        <button
          type="button"
          className={styles.toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
      >
        {links.map((l) =>
          l.internal ? (
            <Link
              key={l.key}
              to={l.to}
              className={`${styles.mobileLink}${activeNav === l.key ? " " + styles.mobileLinkActive : ""}`}
            >
              {l.label}
            </Link>
          ) : (
            <a
              key={l.key}
              href={l.to}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.mobileLink}${activeNav === l.key ? " " + styles.mobileLinkActive : ""}`}
            >
              {l.label}
            </a>
          )
        )}

        <a href={`mailto:${EMAIL}`} className={styles.mobileEmail}>
          <Mail size={17} />
          {EMAIL}
        </a>

        <Link to="/order-now" className={styles.mobileCta}>Order Now</Link>
      </nav>
    </header>
  );
}