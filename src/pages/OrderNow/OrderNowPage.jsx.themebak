import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Paperclip, X, Mail, ShieldCheck } from "lucide-react";
import SEO from "../../components/SEO/SEO";
import {
  getCatalog, getOrder, startOrder, saveOrder, submitOrder, uploadOrderFile, deleteOrderFile,
  loadToken, saveToken, clearToken, attribution,
} from "../../services/ordersApi";
import styles from "./OrderNowPage.module.css";

const CORE_PLACEHOLDERS = {
  name: "Your full name", email: "you@email.com", phone: "+254 700 000 000", country: "Country",
  company: "Company / institution", topic: "Working title of your thesis or project",
};
const INPUT_TYPE = { email: "email", phone: "tel", deadline: "date" };
const AUTOCOMPLETE = { name: "name", email: "email", phone: "tel", country: "country-name" };
const prettify = (k) => k.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

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

  // ── boot: catalog, then resume (?resume= or saved token) or ?service= preselect ──
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

  // Fields of a step, as the API wants them (empty values are never sent: DateField rejects "").
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
        miss[f] = f === "email" ? "We need your email to send the quote." : f === "name" ? "Please tell us your name." : "This is required.";
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

  async function next(extra = {}) {
    if (!step || busy) return;
    setBanner("");
    if (!validateStep(step)) return;
    if (step.input === "review") return finish();
    setBusy(true);
    try {
      // `extra` lets a card click save its value in the same call (state isn't updated yet).
      const payload = { ...payloadFor(step, idx + 1), ...extra };
      await persist(payload);
      setIdx((i) => Math.min(i + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { applyApiErrors(err); } finally { setBusy(false); }
  }

  async function finish() {
    setBusy(true); setBanner("");
    try {
      await persist({}); // guarantees a draft exists
      const res = await submitOrder(tokenRef.current, {});
      clearToken();
      setResult(res);
      setPhase("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { applyApiErrors(err); } finally { setBusy(false); }
  }

  const back = () => { setBanner(""); setIdx((i) => Math.max(0, i - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function pickCard(field, value) {
    set(field, value);
    // Single-answer card steps advance on tap (fast, Toptal-style). Date and file steps use Continue.
    if (step.input === "cards" && step.fields.length === 1) {
      setBusy(true); setBanner("");
      try {
        await persist({ ...payloadFor(step, idx + 1), [field]: value });
        setIdx((i) => Math.min(i + 1, steps.length - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) { applyApiErrors(err); } finally { setBusy(false); }
    }
  }

  async function onFiles(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;
    setBanner(""); setUploading(true);
    try {
      let t = tokenRef.current;
      if (!t) { await persist({ ...payloadFor(steps[0]) }); t = tokenRef.current; }
      const max = catalog.limits.max_files;
      for (const f of picked) {
        if (files.length >= max) { setBanner(`You can attach up to ${max} files.`); break; }
        const mb = catalog.limits.max_file_mb;
        if (f.size > mb * 1024 * 1024) { setBanner(`${f.name} is larger than ${mb} MB. Zip it or email it to us.`); continue; }
        try {
          const rec = await uploadOrderFile(t, f);
          setFiles((cur) => [...cur, rec]);
        } catch (err) { setBanner(`${f.name}: ${err.message}`); }
      }
    } catch (err) { setBanner(err.message); } finally { setUploading(false); }
  }

  async function removeFile(id) {
    try { await deleteOrderFile(tokenRef.current, id); setFiles((c) => c.filter((f) => f.id !== id)); }
    catch (err) { setBanner(err.message); }
  }

  const labelOf = (k) => catalog?.labels?.[k] || prettify(k);
  const serviceLabel = useMemo(
    () => catalog?.services.find((s) => s.slug === values.service)?.label || "",
    [catalog, values.service],
  );
  const pct = steps.length ? Math.round(((idx + 1) / steps.length) * 100) : 0;

  // ── screens ──
  const seo = (
    <SEO
      title="Place Your Order | Chapter 4 & SPSS Data Analysis Help"
      description="Tell us what you need in about two minutes. Get a quote within 24 hours. You pay nothing until you agree."
      path="/order-now"
      keywords="order dissertation data analysis, hire SPSS analyst, dissertation help order"
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Order Now", path: "/order-now" }]}
    />
  );

  if (phase === "loading") return <section className={styles.section}>{seo}<p className={styles.center}>Loading your order form…</p></section>;

  if (phase === "error") {
    return (
      <section className={styles.section}>{seo}
        <div className={styles.card}>
          <h1 className={styles.title}>We couldn't load the order form</h1>
          <p className={styles.sub}>{loadError}</p>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={() => window.location.reload()}>Try again</button>
            <a className={styles.ghost} href="mailto:info@scapedatasolutions.com?subject=New%20order"><Mail size={16} /> Email us your order</a>
          </div>
        </div>
      </section>
    );
  }

  if (phase === "done") {
    return (
      <section className={styles.section}>{seo}
        <div className={styles.card}>
          <div className={styles.doneIcon}><Check size={28} /></div>
          <h1 className={styles.title}>Order received</h1>
          <p className={styles.sub}>
            Your reference is <strong>{result?.reference}</strong>. A confirmation is on its way to {values.email || "your inbox"}.
            We reply within <strong>{catalog.promise?.reply_within || "24 hours"}</strong> with scope, timeline and price.
          </p>
          <p className={styles.note}>Forgot a file or a detail? Just reply to the confirmation email.</p>
          <div className={styles.actions}>
            <Link to="/" className={styles.ghost}>Back to home</Link>
            <button type="button" className={styles.primary} onClick={() => { setValues({}); setFiles([]); setToken(""); setIdx(0); setResult(null); setResumed(false); setPhase("ready"); }}>
              Place another order
            </button>
          </div>
        </div>
      </section>
    );
  }

  const optionsFor = (st) => (st.options_from ? catalog.options[st.options_from] || [] : []);

  function renderField(f, st) {
    const opts = st.options_from && st.fields.length > 1 && f === st.fields[0] ? optionsFor(st) : null;
    const common = {
      id: `f-${f}`, name: f, value: values[f] ?? "", onChange: (e) => set(f, e.target.value),
      "aria-invalid": !!errors[f], autoComplete: AUTOCOMPLETE[f],
    };
    const label = labelOf(f) + ((st.required || []).includes(f) ? " *" : "");
    return (
      <label key={f} htmlFor={`f-${f}`} className={styles.field}>
        <span>{label}</span>
        {opts ? (
          <select {...common}><option value="">Select…</option>{opts.map((o) => <option key={o} value={o}>{o}</option>)}</select>
        ) : (
          <input {...common} type={INPUT_TYPE[f] || "text"} placeholder={CORE_PLACEHOLDERS[f] || ""}
            min={f === "deadline" ? new Date().toISOString().slice(0, 10) : undefined} />
        )}
        {errors[f] && <em className={styles.err}>{errors[f]}</em>}
      </label>
    );
  }

  function renderBody() {
    if (step.input === "cards" || step.input === "cards+date") {
      const field = step.fields[0];
      if (field === "service") {
        return (
          <div>
            {(catalog.categories.length ? catalog.categories : [{ id: "", title: "" }]).map((cat) => {
              const list = catalog.services.filter((s) => (cat.id ? s.category === cat.id : true) && s.category !== "other");
              if (!list.length) return null;
              return (
                <div key={cat.id || "all"} className={styles.group}>
                  {cat.title && <h3 className={styles.groupTitle}>{cat.title}</h3>}
                  <div className={styles.grid}>
                    {list.map((s) => (
                      <button type="button" key={s.slug} disabled={busy}
                        className={`${styles.option} ${values.service === s.slug ? styles.optionOn : ""}`}
                        onClick={() => pickCard("service", s.slug)}>
                        <strong>{s.label}</strong><span>{s.blurb}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {catalog.services.some((s) => s.category === "other") && (
              <div className={styles.grid}>
                <button type="button" disabled={busy}
                  className={`${styles.option} ${values.service === "other" ? styles.optionOn : ""}`}
                  onClick={() => pickCard("service", "other")}>
                  <strong>Something else</strong><span>Not listed? Tell us what you need.</span>
                </button>
              </div>
            )}
            {errors.service && <em className={styles.err}>{errors.service}</em>}
          </div>
        );
      }
      return (
        <div>
          <div className={styles.grid}>
            {optionsFor(step).map((o) => (
              <button type="button" key={o} disabled={busy}
                className={`${styles.option} ${styles.optionSlim} ${values[field] === o ? styles.optionOn : ""}`}
                onClick={() => pickCard(field, o)}>
                <strong>{o}</strong>
              </button>
            ))}
          </div>
          {step.input === "cards+date" && (
            <div className={styles.formStack} style={{ marginTop: 16 }}>
              {renderField("deadline", step)}
            </div>
          )}
          {errors[field] && <em className={styles.err}>{errors[field]}</em>}
        </div>
      );
    }
    if (step.input === "form") {
      return <div className={styles.formStack}>{step.fields.map((f) => renderField(f, step))}</div>;
    }
    if (step.input === "textarea+files") {
      const exts = catalog.limits.allowed_extensions.map((e) => `.${e}`).join(",");
      return (
        <div className={styles.formStack}>
          <label className={styles.field} htmlFor="f-topic"><span>{labelOf("topic")}</span>
            <input id="f-topic" value={values.topic ?? ""} onChange={(e) => set("topic", e.target.value)} placeholder={CORE_PLACEHOLDERS.topic} />
            {errors.topic && <em className={styles.err}>{errors.topic}</em>}
          </label>
          <label className={styles.field} htmlFor="f-details"><span>{labelOf("details")}</span>
            <textarea id="f-details" rows={6} value={values.details ?? ""} onChange={(e) => set("details", e.target.value)}
              placeholder="Your objectives, sample size, what you've done so far, what your supervisor asked for…" />
            {errors.details && <em className={styles.err}>{errors.details}</em>}
          </label>
          <div className={styles.upload}>
            <label className={styles.uploadBtn}>
              <Paperclip size={16} /> {uploading ? "Uploading…" : "Attach your dataset or files"}
              <input type="file" multiple hidden accept={exts} onChange={onFiles} disabled={uploading} />
            </label>
            <span className={styles.note}>SPSS, Excel, CSV, Stata, PDF, Word… up to {catalog.limits.max_file_mb} MB each.</span>
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
      const skip = new Set(["service"]);
      steps.forEach((s) => s.fields.forEach((f) => {
        if (skip.has(f) || values[f] === undefined || values[f] === "") return;
        skip.add(f);
        rows.push([labelOf(f), Array.isArray(values[f]) ? values[f].join(", ") : String(values[f])]);
      }));
      if (files.length) rows.push(["Files", files.map((f) => f.original_name).join(", ")]);
      return (
        <div>
          <dl className={styles.review}>
            {rows.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v || "—"}</dd></div>))}
          </dl>
          <p className={styles.trust}><ShieldCheck size={16} /> You pay nothing until you agree to our quote. Files stay confidential.</p>
        </div>
      );
    }
    return null;
  }

  const isReview = step.input === "review";
  const isCardsOnly = step.input === "cards" && step.fields.length === 1;
  const optional = !(step.required || []).length && step.input !== "review";

  return (
    <section className={styles.section}>
      {seo}
      <div className={styles.card}>
        <div className={styles.progress} aria-label={`Step ${idx + 1} of ${steps.length}`}>
          <div className={styles.bar}><div style={{ width: `${pct}%` }} /></div>
          <span>Step {idx + 1} of {steps.length}</span>
        </div>
        {resumed && idx > 0 && <p className={styles.resumed}>Welcome back. Your answers are saved.</p>}
        <h1 className={styles.title}>{step.title}</h1>
        {step.subtitle && <p className={styles.sub}>{step.subtitle}</p>}
        {banner && <div className={styles.banner} role="alert">{banner}</div>}

        {renderBody()}

        <div className={styles.actions}>
          {idx > 0 ? <button type="button" className={styles.ghost} onClick={back} disabled={busy}><ArrowLeft size={16} /> Back</button> : <span />}
          {!isCardsOnly && (
            <button type="button" className={styles.primary} onClick={() => next()} disabled={busy || uploading}>
              {busy ? "Saving…" : isReview ? "Place my order" : optional ? "Continue" : "Next"}
              {!busy && !isReview && <ArrowRight size={16} />}
            </button>
          )}
          {isCardsOnly && optional && (
            <button type="button" className={styles.ghost} onClick={() => next()} disabled={busy}>Skip <ArrowRight size={16} /></button>
          )}
        </div>
        <p className={styles.footnote}>Free quote in 24 hours · No payment until you agree · Prefer email? <a href="mailto:info@scapedatasolutions.com">info@scapedatasolutions.com</a></p>
      </div>
    </section>
  );
}
