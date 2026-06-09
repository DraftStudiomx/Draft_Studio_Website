"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import Footer from "@/components/layout/Footer";

type Locale = "es" | "en";

const SERVICE_OPTIONS: Record<Locale, { value: string; label: string }[]> = {
  en: [
    { value: "web-design",      label: "Web Design" },
    { value: "web-development", label: "Web Development" },
    { value: "seo",             label: "SEO" },
    { value: "branding",        label: "Branding" },
    { value: "ai-automation",   label: "AI & Automation" },
    { value: "maintenance",     label: "Maintenance & Support" },
    { value: "other",           label: "Other" },
  ],
  es: [
    { value: "web-design",      label: "Diseño Web" },
    { value: "web-development", label: "Desarrollo Web" },
    { value: "seo",             label: "SEO" },
    { value: "branding",        label: "Identidad Visual" },
    { value: "ai-automation",   label: "IA & Automatización" },
    { value: "maintenance",     label: "Mantenimiento & Soporte" },
    { value: "other",           label: "Otro" },
  ],
};

interface FormErrors { name?: string; email?: string; project?: string; }

export default function ContactPage() {
  const locale       = useLocale() as Locale;
  const t            = useTranslations("contact");
  const serviceOptions = SERVICE_OPTIONS[locale];

  const magneticRef = useRef<HTMLSpanElement>(null);
  const formRef     = useRef<HTMLFormElement>(null);
  const [ddOpen,    setDdOpen]    = useState(false);
  const [selected,  setSelected]  = useState<{ value: string; label: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState<FormErrors>({});

  // Reset selected when locale changes (options change)
  useEffect(() => { setSelected(null); }, [locale]);

  /* close dropdown on outside click / Escape */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const dd = document.getElementById("need-dd");
      if (dd && !dd.contains(e.target as Node)) setDdOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setDdOpen(false); };
    document.addEventListener("click", handler);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", handler); document.removeEventListener("keydown", esc); };
  }, []);

  /* magnetic button */
  useEffect(() => {
    const mag = magneticRef.current;
    if (!mag || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = mag.querySelector<HTMLElement>(".btn-fill");
    if (!btn) return;
    const r0 = mag.getBoundingClientRect();
    const docCx = r0.left + window.scrollX + r0.width / 2;
    const docCy = r0.top + window.scrollY + r0.height / 2;
    const radius = r0.height * 1.4;
    let active = false;
    const onDocMove = (e: MouseEvent) => {
      const dx = e.clientX - (docCx - window.scrollX);
      const dy = e.clientY - (docCy - window.scrollY);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) { if (!active) { active = true; btn.classList.add("mag-active"); } }
      else if (active) { active = false; btn.classList.remove("mag-active"); }
    };
    document.addEventListener("mousemove", onDocMove);
    return () => { document.removeEventListener("mousemove", onDocMove); btn.classList.remove("mag-active"); };
  }, []);

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    const currentIdx = selected ? serviceOptions.findIndex((o) => o.value === selected.value) : -1;
    if (!ddOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") { e.preventDefault(); setDdOpen(true); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(serviceOptions[Math.min(currentIdx + 1, serviceOptions.length - 1)]); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelected(serviceOptions[Math.max(currentIdx - 1, 0)]); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDdOpen(false); }
    else if (e.key === "Escape") { e.preventDefault(); setDdOpen(false); }
  };

  function validate(data: { name: string; email: string; project: string }): FormErrors {
    const errors: FormErrors = {};
    if (!data.name.trim()) errors.name = t("errorName");
    if (!data.email.trim()) errors.email = t("errorEmail");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = t("errorEmailInvalid");
    if (!data.project.trim()) errors.project = t("errorProject");
    return errors;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name")    as HTMLInputElement).value,
      email:   (form.elements.namedItem("email")   as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      need:    selected?.value ?? "",
      project: (form.elements.namedItem("project") as HTMLTextAreaElement).value,
    };
    const newErrors = validate(data);
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
      form.reset();
      setSelected(null);
    } catch {
      setErrors({ name: t("errorServer") });
    } finally {
      setLoading(false);
    }
  };

  const btnLabel = submitted ? t("btnSent") : loading ? t("btnSending") : t("btnSend");

  return (
    <>
      <main className="contact-main" style={{ flex: 1, display: "flex", alignItems: "center", padding: "clamp(120px,18vh,200px) var(--gutter) clamp(70px,10vh,110px)" }}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: "clamp(40px,7vw,110px)", width: "100%", alignItems: "start" }}>

          {/* LEFT */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graphite)", marginBottom: "clamp(22px,3.4vh,34px)" }}>
              <span style={{ width: "34px", height: "1px", background: "var(--ds-graph-300)", display: "inline-block" }} />
              {t("eyebrow")}
            </div>
            <h1 className="contact-h1" style={{ fontWeight: 600, fontSize: "clamp(56px,8vw,96px)", lineHeight: 0.9, letterSpacing: "-0.045em" }}>
              {t("h1")}
            </h1>
            <p className="contact-sub" style={{ marginTop: "clamp(24px,3.6vh,34px)", fontSize: "clamp(17px,1.4vw,21px)", lineHeight: 1.5, color: "var(--ds-ink-700)", maxWidth: "34ch" }}>
              {t("sub")}
            </p>

            {/* Info */}
            <div style={{ marginTop: "clamp(46px,7vh,80px)", borderTop: "1px solid var(--ds-rule)", paddingTop: "clamp(28px,4vh,40px)", display: "flex", flexDirection: "column", gap: "clamp(20px,3vh,28px)" }}>
              {[
                { k: t("infoEmail"),    v: "hey@draftstudio.mx",   href: "mailto:hey@draftstudio.mx" },
                { k: t("infoPhone"),    v: "+52 442 485 0730",      href: "tel:+524424850730" },
                { k: t("infoLocation"), v: t("locationValue"),      href: null },
              ].map((item) => (
                <div key={item.k} style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graph-300)" }}>{item.k}</span>
                  {item.href ? (
                    <a href={item.href} className="c-info-link" style={{ fontSize: "clamp(17px,1.4vw,20px)", letterSpacing: "-0.01em", color: "var(--ds-ink)", textDecoration: "none", width: "fit-content", position: "relative" }}>{item.v}</a>
                  ) : (
                    <span style={{ fontSize: "clamp(17px,1.4vw,20px)", letterSpacing: "-0.01em", color: "var(--ds-ink)" }}>{item.v}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginTop: "clamp(30px,4.5vh,44px)", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
              {[
                { label: "Instagram", href: "https://instagram.com/draftstudio.mx" },
                { label: "LinkedIn",  href: "https://linkedin.com/company/draftstudio" },
                { label: "Facebook",  href: "https://facebook.com/draftstudio" },
                { label: "WhatsApp",  href: "https://wa.me/524424850730" },
              ].map((s, i, arr) => (
                <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: "18px" }}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="c-social-link" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ds-ink)", textDecoration: "none", position: "relative", paddingBottom: "3px" }}>{s.label}</a>
                  {i < arr.length - 1 && <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--ds-graph-300)", flexShrink: 0 }} />}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <form ref={formRef} id="contact-form" aria-label="Contact form" noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(24px,3.4vh,32px)" }}>

            {/* Name */}
            <div className="field" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "9px" }}>
              <label htmlFor="f-name" className="field__label" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: errors.name ? "var(--ds-error)" : "var(--ds-graphite)", transition: "color .3s ease" }}>
                {t("fieldName")}
              </label>
              <input type="text" id="f-name" name="name" placeholder={t("fieldNamePlaceholder")} autoComplete="name" required aria-required="true" aria-invalid={!!errors.name}
                style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${errors.name ? "var(--ds-error)" : "var(--ds-rule)"}`, fontFamily: "var(--font-display)", fontSize: "clamp(16px,1.25vw,18px)", color: "var(--ds-ink)", padding: "8px 0 12px", letterSpacing: "-0.01em", borderRadius: 0, outline: "none" }}
                className="ds-input" />
              {errors.name && <span role="alert" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".03em", color: "var(--ds-error)" }}>{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="field" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "9px" }}>
              <label htmlFor="f-email" className="field__label" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: errors.email ? "var(--ds-error)" : "var(--ds-graphite)", transition: "color .3s ease" }}>
                {t("fieldEmail")}
              </label>
              <input type="email" id="f-email" name="email" placeholder={t("fieldEmailPlaceholder")} autoComplete="email" required aria-required="true" aria-invalid={!!errors.email}
                style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${errors.email ? "var(--ds-error)" : "var(--ds-rule)"}`, fontFamily: "var(--font-display)", fontSize: "clamp(16px,1.25vw,18px)", color: "var(--ds-ink)", padding: "8px 0 12px", letterSpacing: "-0.01em", borderRadius: 0, outline: "none" }}
                className="ds-input" />
              {errors.email && <span role="alert" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".03em", color: "var(--ds-error)" }}>{errors.email}</span>}
            </div>

            {/* Company */}
            <div className="field" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "9px" }}>
              <label htmlFor="f-company" className="field__label" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graphite)", transition: "color .3s ease" }}>
                {t("fieldCompany")} <span style={{ color: "var(--ds-graph-300)", textTransform: "none", letterSpacing: ".02em" }}>{t("fieldCompanyOptional")}</span>
              </label>
              <input type="text" id="f-company" name="company" placeholder={t("fieldCompanyPlaceholder")} autoComplete="organization"
                style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid var(--ds-rule)", fontFamily: "var(--font-display)", fontSize: "clamp(16px,1.25vw,18px)", color: "var(--ds-ink)", padding: "8px 0 12px", letterSpacing: "-0.01em", borderRadius: 0, outline: "none" }}
                className="ds-input" />
            </div>

            {/* Dropdown */}
            <div className="field" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "9px" }}>
              <span id="need-label" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: ddOpen ? "var(--ds-cobalto)" : "var(--ds-graphite)", transition: "color .3s ease" }}>
                {t("fieldNeed")}
              </span>
              <div id="need-dd" style={{ position: "relative", width: "100%" }}>
                <button type="button" onClick={(e) => { e.stopPropagation(); setDdOpen(!ddOpen); }} onKeyDown={handleDropdownKeyDown}
                  aria-haspopup="listbox" aria-expanded={ddOpen} aria-labelledby="need-label"
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${ddOpen ? "var(--ds-cobalto)" : "var(--ds-rule)"}`, fontFamily: "var(--font-display)", fontSize: "clamp(16px,1.25vw,18px)", padding: "8px 28px 12px 0", letterSpacing: "-0.01em", borderRadius: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", transition: "border-color .35s cubic-bezier(.22,1,.36,1)", color: selected ? "var(--ds-ink)" : "var(--ds-graph-300)" }}>
                  {selected ? selected.label : t("fieldNeedPlaceholder")}
                </button>
                <span aria-hidden="true" style={{ position: "absolute", right: "2px", bottom: "14px", width: "9px", height: "9px", borderRight: `1.5px solid ${ddOpen ? "var(--ds-cobalto)" : "var(--ds-graphite)"}`, borderBottom: `1.5px solid ${ddOpen ? "var(--ds-cobalto)" : "var(--ds-graphite)"}`, transform: ddOpen ? "rotate(225deg)" : "rotate(45deg)", pointerEvents: "none", transformOrigin: "60% 60%", transition: "border-color .3s ease, transform .3s cubic-bezier(.22,1,.36,1)" }} />
                <ul role="listbox" aria-labelledby="need-label"
                  style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: "100%", zIndex: 30, listStyle: "none", padding: "6px", background: "var(--ds-paper)", border: "1px solid var(--ds-rule)", borderRadius: "4px", boxShadow: "0 18px 44px -18px rgba(14,14,18,.28), 0 4px 12px -6px rgba(14,14,18,.12)", opacity: ddOpen ? 1 : 0, visibility: ddOpen ? "visible" : "hidden", transform: ddOpen ? "translateY(0)" : "translateY(-6px)", transition: "opacity .26s cubic-bezier(.22,1,.36,1), transform .26s cubic-bezier(.22,1,.36,1), visibility .26s" }}>
                  {serviceOptions.map((opt) => (
                    <li key={opt.value} role="option" aria-selected={selected?.value === opt.value} onClick={(e) => { e.stopPropagation(); setSelected(opt); setDdOpen(false); }} className="dd-opt"
                      style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px,1.15vw,17px)", letterSpacing: "-0.01em", padding: "11px 12px", borderRadius: "3px", cursor: "pointer", transition: "background-color .2s ease, color .2s ease", color: selected?.value === opt.value ? "var(--ds-cobalto)" : "var(--ds-ink)" }}>
                      {opt.label}
                    </li>
                  ))}
                </ul>
                <input type="hidden" name="need" value={selected?.value ?? ""} />
              </div>
            </div>

            {/* Message */}
            <div className="field" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "9px" }}>
              <label htmlFor="f-project" className="field__label" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: errors.project ? "var(--ds-error)" : "var(--ds-graphite)", transition: "color .3s ease" }}>
                {t("fieldProject")}
              </label>
              <textarea id="f-project" name="project" rows={4} placeholder={t("fieldProjectPlaceholder")} required aria-required="true" aria-invalid={!!errors.project}
                style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${errors.project ? "var(--ds-error)" : "var(--ds-rule)"}`, fontFamily: "var(--font-display)", fontSize: "clamp(16px,1.25vw,18px)", color: "var(--ds-ink)", padding: "8px 0 12px", letterSpacing: "-0.01em", borderRadius: 0, outline: "none", resize: "none", lineHeight: 1.5 }}
                className="ds-input" />
              {errors.project && <span role="alert" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".03em", color: "var(--ds-error)" }}>{errors.project}</span>}
            </div>

            {/* Submit */}
            <div style={{ marginTop: "clamp(6px,1.4vh,12px)" }}>
              <span className="magnetic" ref={magneticRef} style={{ display: "block", width: "100%" }}>
                <button type="submit" className="btn-fill" disabled={loading || submitted} aria-busy={loading}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".05em", textTransform: "uppercase", background: submitted ? "var(--ds-ink)" : "var(--ds-cobalto)", color: "var(--ds-paper)", border: "none", cursor: loading || submitted ? "default" : "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "19px 26px", borderRadius: "3px", position: "relative", overflow: "hidden", opacity: loading ? 0.75 : 1, transition: "background .3s ease, opacity .3s ease" }}>
                  <span className="btn-fill__label" style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: "10px" }}>{btnLabel}</span>
                </button>
              </span>
              {submitted && (
                <p role="status" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".04em", color: "var(--ds-cobalto)", textAlign: "center", marginTop: "14px" }}>
                  {t("successMsg")}
                </p>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />

      <style>{`
        .ds-input::placeholder { color: var(--ds-graph-300); }
        .ds-input { transition: border-color .35s cubic-bezier(.22,1,.36,1); }
        .ds-input:focus { border-bottom-color: var(--ds-cobalto) !important; }
        .ds-input:focus-visible { outline: none; }
        .field:focus-within .field__label { color: var(--ds-cobalto) !important; }
        .c-info-link::after { content: ""; position: absolute; left: 0; bottom: -3px; height: 1px; width: 0; background: var(--ds-cobalto); transition: width .3s cubic-bezier(.22,1,.36,1); }
        .c-info-link:hover { color: var(--ds-cobalto); }
        .c-info-link:hover::after { width: 100%; }
        .c-social-link::after { content: ""; position: absolute; left: 0; bottom: 0; height: 1px; width: 0; background: var(--ds-cobalto); transition: width .3s cubic-bezier(.22,1,.36,1); }
        .c-social-link:hover { color: var(--ds-cobalto); }
        .c-social-link:hover::after { width: 100%; }
        .dd-opt:hover { background: var(--ds-paper-200); color: var(--ds-cobalto); }
        .btn-fill::before { content: ""; position: absolute; inset: 0; background: var(--ds-ink); transform: translateY(101%); transition: transform .45s cubic-bezier(.22,1,.36,1); z-index: 1; }
        .btn-fill:not(:disabled):hover::before { transform: translateY(0); }
        .btn-fill:disabled { pointer-events: none; }
        .magnetic .btn-fill.mag-active::before { transform: translateY(0) !important; }
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr !important; gap: 54px !important; } button, .ds-input { cursor: auto !important; } }
        @media (max-width: 768px) { .contact-main { padding: 150px var(--gutter) 70px !important; align-items: start !important; } .contact-grid { grid-template-columns: 1fr !important; gap: 54px !important; } .contact-h1 { font-size: 80px !important; } .contact-sub { font-size: 20px !important; max-width: 46ch !important; } }
        @media (max-width: 480px) { .contact-main { padding: 120px var(--gutter) 60px !important; } .contact-h1 { font-size: 52px !important; } .contact-sub { font-size: 17px !important; } }
      `}</style>
    </>
  );
}
