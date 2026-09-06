import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import SEO from "../../components/SEO/SEO";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className={styles.section}>
      <SEO
        title="Contact Us | Free Dissertation Data Analysis Quote"
        description="Send us your research questions, dataset, and deadline for a free quote on Chapter 4 statistical analysis and SPSS dissertation support."
        path="/contact"
        keywords="dissertation help contact, SPSS help quote, chapter 4 data analysis quote"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
      />
      <h2 className={styles.title}>Contact Us</h2>
      <p className={styles.sub}>
        Send us your research questions, dataset, and deadline — we'll follow
        up within 24 hours.
      </p>

      <div className={styles.grid}>
        <div className={styles.info}>
          <div className={styles.infoRow}>
            <Mail size={17} />
            <div>
              <div className={styles.infoLabel}>Email</div>
              <div className={styles.infoValue}>info@thesisdataanalysis.com</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <Phone size={17} />
            <div>
              <div className={styles.infoLabel}>Phone</div>
              <div className={styles.infoValue}>+1 (757) 598-0582</div>
            </div>
          </div>
        </div>

        <div className={styles.formWrap}>
          {sent ? (
            <p className={styles.sentMsg}>
              Thanks — your message has been received. We'll be in touch soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name</label>
                <input name="name" value={form.name} onChange={handleChange} className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Message</label>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange} className={styles.textarea} required />
              </div>
              <button type="submit" className={styles.submitBtn}>Send Message</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
