import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Paperclip, X, Mail, Lock } from "lucide-react";
import SEO from "../../components/SEO/SEO";
import Dropdown from "../../components/Dropdown/Dropdown";
import {
  getCatalog, getOrder, startOrder, saveOrder, submitOrder, uploadOrderFile, deleteOrderFile,
  loadToken, saveToken, clearToken, attribution,
} from "../../services/ordersApi";
import styles from "./OrderNowPage.module.css";

const PLACEHOLDERS = {
  name: "Your full name", email: "you@email.com", phone: "+254 700 000 000", country: "e.g. Kenya",
  company: "Company or institution", topic: "Working title of your thesis or project",
};
const INPUT_TYPE = { email: "email", phone: "tel", deadline: "date" };
const AUTOCOMPLETE = { name: "name", email: "email", phone: "tel", country: "country-name" };
const prettify = (k) => k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
const today = () => new Date().toISOString().slice(0, 10);

export default function OrderNowPage() {
  const [params] = useSearchParams();
  const [catalog, setCatalog] = useState(null);
  const [phase, setPhase] = useState("loading"); // loading | ready | error | done
  const [loadError, setLoadError] = useState("");
  const [idx, setIdx] = useState(0);
  const [values, setValues] = useState({});
  const [token, setToken] = useState("");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [result, setResult] = useState(null);
  const [resumed, setResumed] = useState(false);
  const attrib = useRef(attribution());
  const tokenRef = useRef("");
  tokenRef.current = token;

  const steps = catalog?.steps || [];
  const step = steps[idx];
  const set = (k, v) => { setValues((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const cat = await getCatalog();
        if (!alive) return;
        setCatalog(cat);
        const want = params.get("resume") || loadToken();
        if (want) {
          try {
            const o = await getOrder(want);
            if (!alive) return;
            if (o.is_editable) {
              hydrate(o, cat);
              setToken(o.token); saveToken(o.token); setResumed(true);
              setPhase("ready");
              return;
            }
            clearToken();
          } catch { clearToken(); }
        }
        const svc = params.get("service");
        if (svc) {
          const hit = cat.services.find((s) => s.slug === svc || s.label.toLowerCase() === svc.toLowerCase());
          if (hit) setValues({ service: hit.slug });
        }
        setPhase("ready");
      } catch (err) {
        if (!alive) return;
        setLoadError(err.message);
        setPhase("error");
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function hydrate(o, cat) {
    const v = {};
    ["name", "email", "phone", "country", "academic_level", "data_status", "software",
      "deadline_window", "deadline", "topic", "details"].forEach((k) => { if (o[k]) v[k] = o[k]; });
    if (o.service_slug && o.service_slug !== "other") v.service = o.service_slug;
    else if (o.service) v.service = "other";
    Object.entries(o.extra_answers || {}).forEach(([k, val]) => { v[k] = val; });
    setValues(v);
    setFiles(o.files || []);
    setIdx(Math.min(o.current_step || 0, cat.steps.length - 1));
  }

  // Empty values are never sent: the API's DateField rejects "".
  const payloadFor = useCallback((st, nextIdx) => {
    const out = {};
    (st?.fields || []).forEach((f) => {
      const v = values[f];
      if (v !== undefined && v !== "" && v !== null) out[f] = v;
    });
    if (typeof nextIdx === "number") out.step = nextIdx;
    return out;
  }, [values]);

  async function persist(payload) {
    if (tokenRef.current) return saveOrder(tokenRef.current, payload);
    const res = await startOrder({ ...attrib.current, ...payload });
    setToken(res.token); tokenRef.current = res.token; saveToken(res.token);
    return res;
  }

  function validateStep(st) {
    const miss = {};
    (st.required || []).forEach((f) => {
      const v = values[f];
      if (!v || (typeof v === "string" && !v.trim())) {
        miss[f] = f === "email" ? "We need your email to send the quote." : f === "name" ? "Please tell us your name." : "Please choose an option.";
      }
    });
    setErrors(miss);
    return Object.keys(miss).length === 0;
  }

  function applyApiErrors(err) {
    if (err.fieldErrors) {
      const fe = {};
      Object.entries(err.fieldErrors).forEach(([k, m]) => { fe[k] = Array.isArray(m) ? m[0] : String(m); });
      setErrors(fe);
      const at = steps.findIndex((s) => s.fields.some((f) => fe[f]));
      if (at >= 0) setIdx(at);
    }
    setBanner(err.message);
  }

  async function next() {
    if (!step || busy) return;
    setBanner("");
    if (!validateStep(step)) return;
    if (step.input === "review") return finish();
    setBusy(true);
    try {
      await persist(payloadFor(step, idx + 1));
      setIdx((i) => Math.min(i + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { applyApiErrors(err); } finally { setBusy(false); }
  }

  async function finish() {
    setBusy(true); setBanner("");
    try {
      await persist({});
      const res = await submitOrder(tokenRef.current, {});
      clearToken();
      setResult(res);
      setPhase("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { applyApiErrors(err); } finally { setBusy(false); }
  }

  const back = () => { setBanner(""); setIdx((i) => Math.max(0, i - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function onFiles(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;
    setBanner(""); setUploading(true);
    try {
      if (!tokenRef.current) await persist({});
      const t = tokenRef.current;
      const { max_files: maxFiles, max_file_mb: mb } = catalog.limits;
      let count = files.length;
      for (const f of picked) {
        if (count >= maxFiles) { setBanner(`You can attach up to ${maxFiles} files.`); break; }
        if (f.size > mb * 1024 * 1024) { setBanner(`${f.name} is larger than ${mb} MB. Zip it or email it to us.`); continue; }
        try { const rec = await uploadOrderFile(t, f); setFiles((cur) => [...cur, rec]); count += 1; }
        catch (err) { setBanner(`${f.name}: ${err.message}`); }
      }
    } catch (err) { setBanner(err.message); } finally { setUploading(false); }
  }

  async function removeFile(id) {
    try { await deleteOrderFile(tokenRef.current, id); setFiles((c) => c.filter((f) => f.id !== id)); }
    catch (err) { setBanner(err.message); }
  }

  const labelOf = (k) => catalog?.labels?.[k] || prettify(k);
  const serviceLabel = useMemo(() => catalog?.services.find((s) => s.slug === values.service)?.label || "", [catalog, values.service]);
  const pct = steps.length ? Math.round(((idx + 1) / steps.length) * 100) : 0;

  const seo = (
    <SEO
      title="Place Your Order | Chapter 4 & SPSS Data Analysis Help"
      description="Tell us what you need in about two minutes. Get a quote within 24 hours. You pay nothing until you agree."
      path="/order-now"
      keywords="order dissertation data analysis, hire SPSS analyst, dissertation help order"
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Order Now", path: "/order-now" }]}
    />
  );

  if (phase === "loading") return <section className={styles.root}>{seo}<div className={styles.wrap}><p className={styles.muted}>Loading your order form…</p></div></section>;

  if (phase === "error") {
    return (
      <section className={styles.root}>{seo}
        <div className={styles.wrap}>
          <h1 className={styles.title}>We couldn't load the order form</h1>
          <p className={styles.sub}>{loadError}</p>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={() => window.location.reload()}>Try again</button>
            <a className={styles.secondary} href="mailto:info@scapedatasolutions.com?subject=New%20order"><Mail size={16} /> Email us your order</a>
          </div>
        </div>
      </section>
    );
  }

  if (phase === "done") {
    return (
      <section className={styles.root}>{seo}
        <div className={styles.wrap}>
          <div className={styles.doneIcon}><Check size={24} /></div>
          <h1 className={styles.title}>Thank you. Your order is in.</h1>
          <p className={styles.sub}>
            Your reference is <strong>{result?.reference}</strong>. A confirmation is on its way to {values.email || "your inbox"}.
            We reply within <strong>{catalog.promise?.reply_within || "24 hours"}</strong> with scope, timeline and price.
          </p>
          <p className={styles.muted}>Forgot a file or a detail? Just reply to the confirmation email.</p>
          <div className={styles.actions}>
            <Link to="/" className={styles.secondary}>Back to home</Link>
            <button type="button" className={styles.primary}
              onClick={() => { setValues({}); setFiles([]); setToken(""); setIdx(0); setResult(null); setResumed(false); setPhase("ready"); }}>
              Place another order
            </button>
          </div>
        </div>
      </section>
    );
  }

  const optionsOf = (st, field) => {
    const key = field === st.fields[0] ? st.options_from : null;
    return (key ? catalog.options[key] || [] : []).map((o) => ({ value: o, label: o }));
  };

  function renderInput(f, st) {
    const required = (st.required || []).includes(f);
    return (
      <div key={f} className={styles.field}>
        <label htmlFor={`f-${f}`}>{labelOf(f)}{required ? " *" : ""}</label>
        <input
          id={`f-${f}`} name={f} value={values[f] ?? ""} onChange={(e) => set(f, e.target.value)}
          type={INPUT_TYPE[f] || "text"} placeholder={PLACEHOLDERS[f] || ""} autoComplete={AUTOCOMPLETE[f]}
          aria-invalid={!!errors[f]} min={f === "deadline" ? today() : undefined}
        />
        {errors[f] && <p className={styles.err}>{errors[f]}</p>}
      </div>
    );
  }

  function renderBody() {
    if (step.input === "cards" || step.input === "cards+date") {
      const field = step.fields[0];
      const dateExtra = step.input === "cards+date";
      if (field === "service") {
        const cats = Object.fromEntries((catalog.categories || []).map((c) => [c.id, c.title]));
        const opts = catalog.services.map((s) => ({
          value: s.slug, label: s.label, hint: s.blurb, group: s.category === "other" ? "Not listed?" : cats[s.category] || "",
        }));
        return (
          <Dropdown ariaLabel={step.title} value={values.service} options={opts} searchable
            placeholder="Select a service…" error={errors.service} required
            onChange={(v) => set("service", v)} />
        );
      }
      return (
        <div className={styles.stack}>
          <Dropdown ariaLabel={step.title} value={values[field]} options={optionsOf(step, field)}
            placeholder="Select…" error={errors[field]} onChange={(v) => set(field, v)} />
          {dateExtra && (
            <div className={styles.field}>
              <label htmlFor="f-deadline">Or pick an exact date</label>
              <input id="f-deadline" type="date" min={today()} value={values.deadline ?? ""} onChange={(e) => set("deadline", e.target.value)} />
              {errors.deadline && <p className={styles.err}>{errors.deadline}</p>}
            </div>
          )}
        </div>
      );
    }
    if (step.input === "form") {
      return <div className={styles.stack}>{step.fields.map((f) => {
        const opts = optionsOf(step, f);
        if (opts.length) {
          return <Dropdown key={f} label={labelOf(f)} value={values[f]} options={opts} error={errors[f]} onChange={(v) => set(f, v)} />;
        }
        return renderInput(f, step);
      })}</div>;
    }
    if (step.input === "textarea+files") {
      const exts = catalog.limits.allowed_extensions.map((e) => `.${e}`).join(",");
      return (
        <div className={styles.stack}>
          <div className={styles.field}>
            <label htmlFor="f-topic">{labelOf("topic")}</label>
            <input id="f-topic" value={values.topic ?? ""} onChange={(e) => set("topic", e.target.value)} placeholder={PLACEHOLDERS.topic} />
            {errors.topic && <p className={styles.err}>{errors.topic}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="f-details">{labelOf("details")}</label>
            <textarea id="f-details" rows={5} value={values.details ?? ""} onChange={(e) => set("details", e.target.value)}
              placeholder="Your objectives, sample size, what you've done so far, what your supervisor asked for…" />
            {errors.details && <p className={styles.err}>{errors.details}</p>}
          </div>
          <div>
            <label className={styles.uploadBtn}>
              <Paperclip size={16} /> {uploading ? "Uploading…" : "Attach dataset or files"}
              <input type="file" multiple hidden accept={exts} onChange={onFiles} disabled={uploading} />
            </label>
            <p className={styles.hint}>SPSS, Excel, CSV, Stata, PDF, Word and more. Up to {catalog.limits.max_file_mb} MB each.</p>
            {files.length > 0 && (
              <ul className={styles.files}>
                {files.map((f) => (
                  <li key={f.id}><span>{f.original_name}</span>
                    <button type="button" aria-label={`Remove ${f.original_name}`} onClick={() => removeFile(f.id)}><X size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }
    if (step.input === "review") {
      const rows = [["Service", values.service === "other" ? "Something else" : serviceLabel]];
      const seen = new Set(["service"]);
      steps.forEach((s) => s.fields.forEach((f) => {
        if (seen.has(f) || values[f] === undefined || values[f] === "") return;
        seen.add(f);
        rows.push([labelOf(f), Array.isArray(values[f]) ? values[f].join(", ") : String(values[f])]);
      }));
      if (files.length) rows.push(["Files", files.map((f) => f.original_name).join(", ")]);
      return (
        <div>
          <dl className={styles.review}>
            {rows.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v || "—"}</dd></div>))}
          </dl>
          <p className={styles.secure}><Lock size={14} /> You pay nothing until you agree to our quote. Your files stay confidential.</p>
        </div>
      );
    }
    return null;
  }

  const isReview = step.input === "review";
  const intro = idx === 0 && !resumed;

  return (
    <section className={styles.root}>
      {seo}
      <div className={styles.progress}><div style={{ width: `${pct}%` }} /></div>
      <div className={styles.wrap}>
        {intro && (
          <p className={styles.intro}>
            Thanks for your interest in working with Scape Data Solutions! Before we get started, we'd like to ask a few
            questions to better understand what you need.
          </p>
        )}
        {resumed && idx > 0 && <p className={styles.intro}>Welcome back. Your answers are saved.</p>}
        <p className={styles.eyebrow}>Step {idx + 1} of {steps.length}</p>
        <h1 className={styles.title}>{step.title}</h1>
        {step.subtitle && <p className={styles.sub}>{step.subtitle}</p>}
        {banner && <div className={styles.banner} role="alert">{banner}</div>}

        <div className={styles.body}>{renderBody()}</div>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={next} disabled={busy || uploading}>
            {busy ? "Saving…" : isReview ? "Place my order" : "Continue"}
          </button>
          {idx > 0 && (
            <button type="button" className={styles.back} onClick={back} disabled={busy}><ArrowLeft size={16} /> Back</button>
          )}
        </div>
        <p className={styles.footnote}>Free quote in 24 hours. No payment until you agree. Prefer email? <a href="mailto:info@scapedatasolutions.com">info@scapedatasolutions.com</a></p>
      </div>
    </section>
  );
}
