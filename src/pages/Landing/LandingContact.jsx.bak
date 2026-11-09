import { useEffect, useState } from "react";
import { apiService } from "../../services/api";
import { landingPages, SITE } from "./landingData";
import styles from "./LandingForm.module.css";

const LEVELS = ["Undergraduate", "Masters", "PhD", "Journal paper / research", "Other"];
const SOFTWARE = ["SPSS", "Excel", "R", "Stata", "Python", "AMOS / SmartPLS", "Not sure"];
const EMPTY = { name: "", email: "", phone: "", level: "", service: "", software: "", deadline: "", message: "", website: "" };

export default function LandingContact({ page }) {
  const [form, setForm] = useState({ ...EMPTY, service: page ? page.short : "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => { setForm((f) => ({ ...f, service: page ? page.short : "" })); }, [page]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.website) { setDone(true); return; } // honeypot: bots only
    setLoading(true);
    setError(null);
    try {
      const source = page ? `${SITE}/${page.slug}` : `${SITE}/data-analysis-services`;
      const message = [
        form.message.trim(),
        "",
        `Level: ${form.level || "not given"}`,
        `Software: ${form.software || "not given"}`,
        `Deadline: ${form.deadline || "not given"}`,
        `[Submitted from: ${source}]`,
      ].join("\n");
      await apiService.submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.level || "Student",
        phone: form.phone.trim(),
        service: form.service,
        message,
      });
      setDone(true);
    } catch (err) {
      setError(err.message || "Failed to send. Please email info@scapedatasolutions.com directly.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <section id="request" className={styles.wrap}>
        <h2 className={styles.h2}>Request received</h2>
        <p className={styles.sub}>Thank you. We will review your details and reply within 24 hours with a quote and questions if anything is unclear.</p>
        <button type="button" className={styles.again} onClick={() => { setForm({ ...EMPTY, service: page ? page.short : "" }); setDone(false); }}>Send another request</button>
      </section>
    );
  }

  return (
    <section id="request" className={styles.wrap}>
      <div className={styles.side}>
        <h2 className={styles.h2}>Get a free quote</h2>
        <p className={styles.sub}>Tell us what you need. We reply within 24 hours with scope, timeline and price. You pay nothing until you agree.</p>
        <p className={styles.small}>Helpful to include</p>
        <ul className={styles.list}>
          <li>Your research objectives or hypotheses</li>
          <li>Sample size and the software you have</li>
          <li>Supervisor comments, if any</li>
          <li>Your deadline</li>
        </ul>
        <p className={styles.small}>Prefer email? <a href="mailto:info@scapedatasolutions.com">info@scapedatasolutions.com</a></p>
      </div>

      <form onSubmit={onSubmit} className={styles.form} noValidate={false}>
        {error && <div className={styles.error} role="alert">{error}</div>}

        <div className={styles.row}>
          <label>Full name *
            <input name="name" value={form.name} onChange={onChange} required placeholder="Your name" autoComplete="name" />
          </label>
          <label>Email *
            <input type="email" name="email" value={form.email} onChange={onChange} required placeholder="you@email.com" autoComplete="email" />
          </label>
        </div>

        <div className={styles.row}>
          <label>Phone / WhatsApp (with country code)
            <input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="+1 202 555 0123" autoComplete="tel" />
          </label>
          <label>Academic level
            <select name="level" value={form.level} onChange={onChange}>
              <option value="">Select...</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
        </div>

        <label>What do you need help with? *
          <select name="service" value={form.service} onChange={onChange} required>
            <option value="">Select a service...</option>
            {landingPages.map((p) => <option key={p.slug} value={p.short}>{p.short}</option>)}
            <option value="Other">Something else</option>
          </select>
        </label>

        <div className={styles.row}>
          <label>Software
            <select name="software" value={form.software} onChange={onChange}>
              <option value="">Select...</option>
              {SOFTWARE.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>Deadline
            <input type="date" name="deadline" value={form.deadline} onChange={onChange} />
          </label>
        </div>

        <label>Project details *
          <textarea name="message" value={form.message} onChange={onChange} required minLength={20} rows={5}
            placeholder="Your objectives, sample size, what you have done so far, and what your supervisor asked for" />
        </label>

        {/* honeypot */}
        <input type="text" name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" className={styles.hp} aria-hidden="true" />

        <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send request"}</button>
        <p className={styles.note}>Your files and details stay confidential.</p>
      </form>
    </section>
  );
}
