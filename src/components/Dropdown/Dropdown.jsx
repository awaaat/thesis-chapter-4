import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import styles from "./Dropdown.module.css";

/**
 * Accessible single-select dropdown (combobox + listbox), Toptal styled.
 * options: [{ value, label, hint?, group? }]   (group = section heading)
 */
export default function Dropdown({
  label, value, onChange, options, placeholder = "Select…", searchable = false,
  error, required = false, disabled = false, ariaLabel,
}) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => `${o.label} ${o.hint || ""} ${o.group || ""}`.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (root.current && !root.current.contains(e.target)) close(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("touchstart", onDown); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const idx = Math.max(0, filtered.findIndex((o) => o.value === value));
    setActive(idx);
    if (searchable) setTimeout(() => searchRef.current?.focus(), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function close(refocus = true) {
    setOpen(false); setQuery("");
    if (refocus) triggerRef.current?.focus();
  }
  function choose(o) { onChange(o.value); close(); }

  function onKeyDown(e) {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); setOpen(true); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(filtered.length - 1); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[active]) choose(filtered[active]); }
    else if (e.key === "Tab") { close(false); }
  }

  let lastGroup = null;
  return (
    <div className={styles.root} ref={root} onKeyDown={onKeyDown}>
      {label && <label className={styles.label} htmlFor={`${uid}-btn`}>{label}{required ? " *" : ""}</label>}
      <button
        id={`${uid}-btn`} ref={triggerRef} type="button" disabled={disabled}
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""} ${error ? styles.triggerError : ""}`}
        role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${uid}-list`}
        aria-label={!label ? ariaLabel : undefined} aria-invalid={!!error}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span className={selected ? styles.value : styles.placeholder}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={18} className={`${styles.chev} ${open ? styles.chevOpen : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.panel}>
          {searchable && (
            <div className={styles.search}>
              <Search size={16} aria-hidden="true" />
              <input ref={searchRef} value={query} placeholder="Search…" aria-label="Search options"
                onChange={(e) => { setQuery(e.target.value); setActive(0); }} />
            </div>
          )}
          <ul id={`${uid}-list`} role="listbox" ref={listRef} className={styles.list}>
            {filtered.length === 0 && <li className={styles.empty}>No matches</li>}
            {filtered.map((o, i) => {
              const heading = o.group && o.group !== lastGroup ? o.group : null;
              lastGroup = o.group || lastGroup;
              return (
                <li key={o.value} role="presentation">
                  {heading && <div className={styles.group}>{heading}</div>}
                  <div
                    role="option" data-i={i} aria-selected={o.value === value}
                    className={`${styles.option} ${i === active ? styles.optionActive : ""} ${o.value === value ? styles.optionOn : ""}`}
                    onMouseEnter={() => setActive(i)} onClick={() => choose(o)}
                  >
                    <span className={styles.optText}>
                      <span className={styles.optLabel}>{o.label}</span>
                      {o.hint && <span className={styles.optHint}>{o.hint}</span>}
                    </span>
                    {o.value === value && <Check size={16} aria-hidden="true" />}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
