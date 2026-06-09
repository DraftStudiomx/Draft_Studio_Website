"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";

type Step = { num: string; title: string; desc: string };

const STEPS: Record<string, Step[]> = {
  en: [
    { num: "01", title: "Discovery",  desc: "We learn your business, goals, and competitive landscape." },
    { num: "02", title: "Strategy",   desc: "We define the right approach before writing a single line of code." },
    { num: "03", title: "Build",      desc: "Precision design and development, iterated with your feedback." },
    { num: "04", title: "Launch",     desc: "Deployment, QA, and post-launch support." },
  ],
  es: [
    { num: "01", title: "Descubrimiento", desc: "Entendemos tu negocio antes de tocar el diseño. Sin suposiciones." },
    { num: "02", title: "Estrategia",     desc: "Primero el plan, después el código. Cero cambios de rumbo a mitad del camino." },
    { num: "03", title: "Construcción",   desc: "Iteraciones cortas y reales, con tu retroalimentación desde el día uno." },
    { num: "04", title: "Lanzamiento",    desc: "Despliegue limpio y soporte real. No desaparecemos después de publicar." },
  ],
};

export default function Process() {
  const locale   = useLocale() as "es" | "en";
  const t        = useTranslations("process");
  const steps    = STEPS[locale] ?? STEPS.en;
  const stepRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = stepRefs.current.filter(Boolean);
    if (!els.length) return;

    gsap.set(els, { opacity: 0, y: 30 });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLDivElement);
        if (!visible.length) return;
        visible.forEach((el) => observer.unobserve(el));
        gsap.to(visible, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.12, overwrite: true });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      gsap.set(els, { clearProps: "opacity,transform" });
    };
  }, [locale]);

  return (
    <section
      aria-label="Process"
      style={{
        background: "var(--ds-paper)",
        padding: "clamp(48px,6vh,80px) var(--gutter) clamp(90px,12vh,140px)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "20px", marginBottom: "clamp(30px,4vh,44px)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
          <span style={{ width: "26px", height: "1px", background: "var(--ds-graphite)", display: "inline-block" }} />
          {t("label")}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", color: "var(--ds-graph-300)" }}>
          {t("stepsCount")}
        </span>
      </div>

      {/* Grid */}
      <div className="process-grid">
        {steps.map((step, i) => (
          <div
            key={step.num}
            ref={(el) => { if (el) stepRefs.current[i] = el; }}
            className="step"
            style={{
              position: "relative",
              paddingTop: "clamp(28px,3.8vh,46px)",
              paddingRight: "clamp(18px,2vw,34px)",
              paddingBottom: "clamp(28px,4vh,48px)",
              paddingLeft: i === 0 ? 0 : "clamp(18px,2vw,34px)",
              borderLeft: i === 0 ? "none" : "1px solid var(--ds-rule)",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".12em", color: "var(--ds-graphite)" }}>
              {step.num}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(22px,2.1vw,30px)", letterSpacing: "-0.02em", color: "var(--ds-ink)", margin: "clamp(24px,4vh,44px) 0 14px" }}>
              {step.title}
            </h3>
            <p style={{ fontSize: "15px", lineHeight: 1.5, color: "var(--ds-graphite)", maxWidth: "30ch" }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
