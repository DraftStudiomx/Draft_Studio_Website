"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/layout/Footer";

type Locale = "es" | "en";
type DataItem = { num: string; title: string; desc: string };

const VALUES: Record<Locale, DataItem[]> = {
  en: [
    { num: "01", title: "Precision", desc: "Every pixel, every line of code, intentional." },
    { num: "02", title: "Craft",     desc: "We obsess over the details others skip." },
    { num: "03", title: "Honesty",   desc: "Clear communication, no surprises." },
  ],
  es: [
    { num: "01", title: "Precisión",   desc: "Nada es accidental. Cada decisión — de diseño o de código — tiene una razón." },
    { num: "02", title: "Detalle",     desc: "Los detalles que nadie nota son exactamente los que marcan la diferencia." },
    { num: "03", title: "Honestidad",  desc: "Plazos reales, expectativas claras. Sin sorpresas al final del camino." },
  ],
};

const STEPS: Record<Locale, DataItem[]> = {
  en: [
    { num: "01", title: "Discovery", desc: "We start by learning your business inside out — goals, audience, competitive landscape, and the metrics that actually matter. No assumptions, just questions until the picture is sharp." },
    { num: "02", title: "Strategy",  desc: "We define the right approach before writing a single line of code: information architecture, content priorities, and the technical foundation. A clear plan means no wasted motion later." },
    { num: "03", title: "Build",     desc: "Precision design and development, iterated openly with your feedback. You see progress in real time — not a big reveal at the end. Every component is crafted, tested, and tuned for speed." },
    { num: "04", title: "Launch",    desc: "Deployment, QA, and the post-launch support that keeps things sharp. We don't disappear after go-live — we monitor, refine, and stay on call as your site grows." },
  ],
  es: [
    { num: "01", title: "Descubrimiento", desc: "Antes de abrir un editor, entendemos tu negocio: tus objetivos, tu audiencia y el terreno donde compites. Solo hacemos preguntas — hasta que el panorama está completamente nítido." },
    { num: "02", title: "Estrategia",     desc: "Primero el plan, después el código. Definimos arquitectura, prioridades de contenido y base técnica antes de arrancar. Un punto de partida sólido significa cero cambios de dirección a mitad del camino." },
    { num: "03", title: "Construcción",   desc: "Diseño y desarrollo en ciclos cortos, con tu retroalimentación en el centro. Ves el progreso en tiempo real — no hay grandes revelaciones al final. Cada componente sale probado y afinado." },
    { num: "04", title: "Lanzamiento",   desc: "Despliegue limpio, QA exhaustivo y soporte real después de publicar. No desaparecemos al hacer clic en 'publicar' — monitoreamos, ajustamos y estamos disponibles mientras tu sitio crece." },
  ],
};

const ABOUT: Record<Locale, { k: string; p: string }[]> = {
  en: [
    { k: "The studio",    p: "Draft Studio is a small, senior team of designers and engineers. We partner with established companies and ambitious founders who treat their digital presence as a core asset — not an afterthought." },
    { k: "What drives us", p: "We're driven by the belief that a website should feel inevitable: fast, clear, and unmistakably yours. Every project is bespoke, every detail deliberate. We'd rather ship one remarkable thing than ten forgettable ones." },
    { k: "Where we work", p: "Based in Mexico — working with brands across North America and Europe. Remote by default, precise by design." },
  ],
  es: [
    { k: "El estudio",       p: "Draft Studio es un equipo compacto de diseñadores e ingenieros. Trabajamos con empresas consolidadas, fundadores y en crecimiento que entienden que su sitio web no es un gasto — es una ventaja competitiva." },
    { k: "Lo que nos mueve", p: "Creemos que un buen sitio web no se nota — simplemente funciona. Es rápido, claro y se siente como tuyo desde el primer clic. Preferimos construir una cosa que valga la pena que diez que no dejan huella." },
    { k: "Dónde trabajamos", p: "Equipo con base en México, trabajando con marcas en Norteamérica y Europa. Remotos de raíz, obsesionados con los detalles." },
  ],
};

export default function StudioPage() {
  const locale      = useLocale() as Locale;
  const t           = useTranslations("studio");
  const values      = VALUES[locale] ?? VALUES.en;
  const steps       = STEPS[locale] ?? STEPS.en;
  const about       = ABOUT[locale] ?? ABOUT.en;
  const magneticRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointerFine   = window.matchMedia("(pointer: fine)").matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        const all = gsap.utils.toArray<HTMLElement>("[data-vstep], [data-pstep]");
        gsap.set(all, { opacity: 1, y: 0 });
        const words = gsap.utils.toArray<HTMLElement>("#ctaHeadline .w");
        gsap.set(words, { color: "#F1EEE5" });
        return;
      }
      ["[data-vstep]", "[data-pstep]"].forEach((sel) => {
        const items = gsap.utils.toArray<HTMLElement>(sel);
        if (!items.length) return;
        gsap.set(items, { opacity: 0, y: 30 });
        ScrollTrigger.batch(items, {
          start: "top 86%",
          onEnter: (els) => { gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.12, overwrite: true }); },
        });
      });
      const PAPER = "#F1EEE5", COBALTO = "#2B41E5";
      const words = gsap.utils.toArray<HTMLElement>("#ctaHeadline .w");
      if (words.length) {
        const wtl = gsap.timeline({ scrollTrigger: { trigger: "#cta-section", start: "top 72%", end: "bottom 80%", scrub: 0.6 } });
        words.forEach((w, i) => {
          const pos = i * 0.5;
          if (w.dataset.hl !== undefined) {
            wtl.to(w, { color: COBALTO, duration: 0.4, ease: "none" }, pos)
               .to(w, { color: PAPER, duration: 0.45, ease: "none" }, pos + 0.4);
          } else {
            wtl.to(w, { color: PAPER, duration: 0.55, ease: "none" }, pos);
          }
        });
      }
    });

    const pstepCleanups: (() => void)[] = [];
    if (!reducedMotion) {
      const psteps = gsap.utils.toArray<HTMLElement>("[data-pstep]");
      psteps.forEach((step) => {
        const title = step.querySelector<HTMLElement>(".pstep__title");
        const num   = step.querySelector<HTMLElement>(".pstep__num");
        if (!title) return;
        const enter = () => { gsap.to(title, { x: 8, duration: 0.55, ease: "power3.out" }); if (num) gsap.to(num, { color: "#2B41E5", duration: 0.4, ease: "power3.out" }); };
        const leave = () => { gsap.to(title, { x: 0, duration: 0.6, ease: "power3.out" }); if (num) gsap.to(num, { color: "#B9B5A8", duration: 0.4, ease: "power3.out" }); };
        step.addEventListener("mouseenter", enter);
        step.addEventListener("mouseleave", leave);
        pstepCleanups.push(() => { step.removeEventListener("mouseenter", enter); step.removeEventListener("mouseleave", leave); });
      });
    }

    let magCleanup: (() => void) | null = null;
    const mag = magneticRef.current;
    if (mag && pointerFine && !reducedMotion) {
      const btn = mag.querySelector<HTMLElement>(".btn-fill");
      if (btn) {
        const r0 = mag.getBoundingClientRect();
        const docCx = r0.left + window.scrollX + r0.width / 2;
        const docCy = r0.top + window.scrollY + r0.height / 2;
        const radius = Math.max(r0.width, r0.height) * 0.75;
        let active = false;
        const onDocMove = (e: MouseEvent) => {
          const dx = e.clientX - (docCx - window.scrollX);
          const dy = e.clientY - (docCy - window.scrollY);
          if (Math.sqrt(dx * dx + dy * dy) < radius) {
            if (!active) { active = true; btn.classList.add("mag-active"); gsap.to(btn, { color: "#0E0E12", duration: 0.25, ease: "none" }); }
          } else if (active) { active = false; btn.classList.remove("mag-active"); gsap.to(btn, { color: "#F1EEE5", duration: 0.25, ease: "none" }); }
        };
        document.addEventListener("mousemove", onDocMove);
        magCleanup = () => { document.removeEventListener("mousemove", onDocMove); btn.classList.remove("mag-active"); gsap.set(btn, { color: "#F1EEE5" }); };
      }
    }

    return () => { ctx.revert(); pstepCleanups.forEach((fn) => fn()); magCleanup?.(); };
  }, [locale]);

  return (
    <>
      <main>
        {/* S1 · Hero */}
        <header className="studio-header" style={{ padding: "clamp(150px,22vh,230px) var(--gutter) clamp(70px,11vh,120px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graphite)", marginBottom: "clamp(20px,3vh,30px)" }}>
            <span style={{ width: "34px", height: "1px", background: "var(--ds-graph-300)", display: "inline-block" }} />
            {t("eyebrow")}
          </div>
          <h1 className="studio-h1" style={{ fontWeight: 600, fontSize: "clamp(64px,13vw,140px)", lineHeight: 0.88, letterSpacing: "-0.05em" }}>
            Studio
          </h1>
          <p className="studio-subline" style={{ marginTop: "clamp(30px,5vh,52px)", maxWidth: "20ch", fontWeight: 500, fontSize: "clamp(24px,3.4vw,46px)", lineHeight: 1.12, letterSpacing: "-0.025em", textWrap: "balance" }}>
            {t("subline").split(t("sublineMexico"))[0]}
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ds-graphite)" }}>{t("sublineMexico")}</em>
            {t("subline").split(t("sublineMexico"))[1]}
          </p>
        </header>

        {/* S2 · About */}
        <section aria-label="About" style={{ padding: "clamp(60px,9vh,110px) var(--gutter) clamp(90px,13vh,150px)", borderTop: "1px solid var(--ds-rule)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "clamp(40px,7vw,110px)", alignItems: "start" }} className="about-grid">
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ds-graphite)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(30px,5vh,52px)" }}>
                <span style={{ width: "26px", height: "1px", background: "var(--ds-graphite)", display: "inline-block" }} />
                {t("whoLabel")}
              </div>
              <p className="about-quote" style={{ fontWeight: 400, fontStyle: "italic", fontSize: "clamp(32px,4.6vw,64px)", lineHeight: 1.04, letterSpacing: "-0.03em", textWrap: "balance" }}>
                {t("quote")}{" "}
                <span style={{ fontStyle: "italic", color: "var(--ds-cobalto)" }}>{t("quoteAccent")}</span>
              </p>
            </div>
            <div className="about-copy" style={{ paddingTop: "clamp(8px,2vh,18px)", display: "flex", flexDirection: "column", gap: "clamp(18px,2.6vh,30px)" }}>
              {about.map((item) => (
                <p key={item.k} style={{ fontSize: "clamp(16px,1.3vw,20px)", lineHeight: 1.62, color: "var(--ds-ink-700)", maxWidth: "46ch", textWrap: "pretty" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graph-300)", display: "block", marginBottom: "10px" }}>{item.k}</span>
                  {item.p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* S3 · Values */}
        <section aria-label="Values" style={{ background: "var(--ds-ink)", color: "var(--ds-paper)", padding: "clamp(90px,13vh,150px) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "20px", marginBottom: "clamp(30px,4vh,44px)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ds-graph-300)" }}>
              <span style={{ width: "26px", height: "1px", background: "var(--ds-graph-300)", display: "inline-block" }} />
              {t("valuesLabel")}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", color: "#5a5a63" }}>{t("valuesPrinciples")}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid var(--ds-ink-700)" }} className="values-grid">
            {values.map((v, i) => (
              <div key={v.num} data-vstep className="value-card" style={{ position: "relative", paddingTop: "clamp(30px,4.4vh,52px)", paddingRight: "clamp(20px,2.4vw,40px)", paddingBottom: "clamp(34px,6vh,70px)", paddingLeft: i === 0 ? "0" : "clamp(20px,2.4vw,40px)", borderLeft: i > 0 ? "1px solid var(--ds-ink-700)" : "none" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".12em", color: "var(--ds-graph-300)", transition: "color .3s ease" }} className="value-num">{v.num}</div>
                <h3 className="value-title" style={{ fontWeight: 600, fontSize: "clamp(28px,3vw,44px)", letterSpacing: "-0.03em", color: "var(--ds-paper)", margin: "clamp(44px,8vh,88px) 0 16px" }}>{v.title}</h3>
                <p style={{ fontSize: "clamp(15px,1.15vw,17px)", lineHeight: 1.55, color: "var(--ds-graph-300)", maxWidth: "32ch", textWrap: "pretty" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* S4 · Process */}
        <section aria-label="Process" style={{ background: "var(--ds-paper)", padding: "clamp(90px,13vh,150px) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "20px", marginBottom: "clamp(36px,5vh,56px)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
              <span style={{ width: "26px", height: "1px", background: "var(--ds-graphite)", display: "inline-block" }} />
              {t("processLabel")}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", color: "var(--ds-graph-300)" }}>{t("processSteps")}</span>
          </div>
          {steps.map((s, i) => (
            <div key={s.num} data-pstep className="pstep" style={{ display: "grid", gridTemplateColumns: "120px 0.9fr 1.1fr", gap: "clamp(20px,4vw,70px)", alignItems: "baseline", padding: "clamp(30px,4.6vh,52px) 0", borderTop: "1px solid var(--ds-rule)", borderBottom: i === steps.length - 1 ? "1px solid var(--ds-rule)" : "none" }}>
              <span className="pstep__num" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".1em", color: "var(--ds-cobalto)" }}>{s.num}</span>
              <h3 className="pstep__title pstep-title" style={{ fontWeight: 600, fontSize: "clamp(26px,3.2vw,46px)", letterSpacing: "-0.035em", lineHeight: 0.98 }}>{s.title}</h3>
              <p style={{ fontSize: "clamp(16px,1.25vw,19px)", lineHeight: 1.6, color: "var(--ds-ink-700)", maxWidth: "48ch", textWrap: "pretty" }}>{s.desc}</p>
            </div>
          ))}
        </section>

        {/* S5 · CTA */}
        <section id="cta-section" aria-label="Start a project" style={{ background: "var(--ds-ink)", color: "var(--ds-paper)", padding: "clamp(120px,18vh,200px) var(--gutter) clamp(38px,6vh,64px)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(40px,7vh,72px)", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
              {t("ctaLabel")}
            </div>
            <h2 id="ctaHeadline" style={{ fontWeight: 600, fontSize: "clamp(40px,7vw,96px)", lineHeight: 1.0, letterSpacing: "-0.04em", maxWidth: "15ch", textWrap: "balance" }}>
              <span className="w" style={{ display: "inline-block", color: "rgba(241,238,229,.16)" }}>{t("ctaHeadline1")}</span>{" "}
              <span className="w" style={{ display: "inline-block", color: "rgba(241,238,229,.16)" }}>{t("ctaHeadline2")}</span>{" "}
              <span className="w" data-hl="" style={{ display: "inline-block", color: "rgba(241,238,229,.16)" }}>{t("ctaHeadline3")}</span>
            </h2>
            <p style={{ marginTop: "clamp(26px,4vh,40px)", fontSize: "clamp(16px,1.25vw,19px)", lineHeight: 1.5, color: "var(--ds-graphite)", maxWidth: "42ch" }}>
              {t("ctaSub")}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "22px", marginTop: "clamp(34px,5vh,52px)", flexWrap: "wrap" }}>
              <span className="magnetic" ref={magneticRef}>
                <Link href="/contact" className="btn-fill" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".05em", textTransform: "uppercase", background: "var(--ds-cobalto)", color: "var(--ds-paper)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", padding: "17px 26px", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
                  <span className="btn-fill__label" style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: "10px" }}>{t("ctaBtn")}</span>
                </Link>
              </span>
              <a href="mailto:hey@draftstudio.mx" className="cta-mail" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".03em", color: "var(--ds-paper)", textDecoration: "none", position: "relative", padding: "6px 2px" }}>
                hey@draftstudio.mx
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .pstep__title { will-change: transform, color; }
        .pstep__num   { will-change: color; }
        .value-card:hover .value-num { color: var(--ds-cobalto) !important; }
        .btn-fill::before { content: ""; position: absolute; inset: 0; background: var(--ds-paper); transform: translateY(101%); transition: transform .45s cubic-bezier(.22,1,.36,1); z-index: 1; }
        .btn-fill:hover, .btn-fill:active { color: var(--ds-ink) !important; }
        .btn-fill:hover::before, .btn-fill:active::before { transform: translateY(0); }
        .magnetic .btn-fill.mag-active::before { transform: translateY(0) !important; }
        .magnetic .btn-fill.mag-active { color: var(--ds-ink) !important; }
        .cta-mail::after { content: ""; position: absolute; left: 2px; right: 2px; bottom: 0; height: 1px; background: var(--ds-paper); transform: scaleX(0); transform-origin: left; transition: transform .4s cubic-bezier(.22,1,.36,1); }
        .cta-mail:hover::after { transform: scaleX(1); }
        @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; } .values-grid { grid-template-columns: 1fr !important; } .pstep { grid-template-columns: 1fr !important; gap: 14px !important; } }
        @media (max-width: 768px) { .studio-header { padding: 158px var(--gutter) 78px !important; } .studio-h1 { font-size: 104px !important; } .studio-subline { font-size: 32px !important; max-width: 24ch !important; } .about-grid { grid-template-columns: 1fr 1fr !important; gap: 48px !important; } .about-quote { font-size: 46px !important; } .about-copy p { font-size: 18px !important; } .values-grid { grid-template-columns: 1fr !important; border-top: none !important; } .values-grid .value-card { border-left: none !important; border-top: 1px solid var(--ds-ink-700) !important; padding-left: 0 !important; padding-right: 0 !important; } .values-grid .value-card:first-child { border-top: none !important; } .value-title { font-size: 34px !important; margin-top: 24px !important; } .pstep { grid-template-columns: 1fr !important; gap: 12px !important; } .pstep-title { font-size: 34px !important; } }
        @media (max-width: 480px) { .studio-h1 { font-size: 56px !important; } .studio-subline { font-size: 24px !important; } .about-grid { grid-template-columns: 1fr !important; } }
        .magnetic .btn-fill.mag-active { color: var(--ds-ink) !important; }
      `}</style>
    </>
  );
}
