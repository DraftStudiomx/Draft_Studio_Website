"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/layout/Footer";

const CHIPS: Record<string, string[]> = {
  "01": ["UX/UI Design", "Prototyping", "Design System", "Wireframing", "Responsive Design", "Interaction Design"],
  "02": ["E-commerce", "Next.js", "CMS Integration", "Deployment", "Performance Optimization", "API Development"],
  "03": ["Technical SEO", "On-Page SEO", "Content Strategy", "Google Search Console", "Core Web Vitals", "Link Building"],
  "04": ["Logo Design", "Color System", "Typography", "Brand Guidelines", "Brand Strategy", "Iconography", "Motion Identity"],
  "05": ["AI Integration", "Workflow Automation", "Smart Chatbots", "API Connections", "OpenAI", "n8n", "Zapier"],
  "06": ["Hosting", "Updates", "Monitoring", "Performance", "Security", "Backups", "Analytics", "A/B Testing"],
};

const NOS = ["01", "02", "03", "04", "05", "06"];

export default function ServicesPage() {
  const t           = useTranslations("services");
  const magneticRef = useRef<HTMLSpanElement>(null);

  const services = NOS.map((no) => ({
    no,
    name: t(`svc${no}name` as Parameters<typeof t>[0]),
    desc: t(`svc${no}desc` as Parameters<typeof t>[0]),
    chips: CHIPS[no],
  }));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointerFine   = window.matchMedia("(pointer: fine)").matches;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (reducedMotion) { gsap.set(els, { opacity: 1, y: 0 }); return; }
      gsap.set(els, { opacity: 0, y: 32 });
      ScrollTrigger.batch(els, {
        start: "top 90%",
        onEnter: (targets) => { gsap.to(targets, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.09, overwrite: true }); },
      });
    });

    const rowCleanups: (() => void)[] = [];
    if (!reducedMotion) {
      const rows = Array.from(document.querySelectorAll<HTMLElement>(".svc-row"));
      rows.forEach((row) => {
        const grid  = row.querySelector<HTMLElement>(".svc-grid");
        const arrow = row.querySelector<HTMLElement>(".svc-arrow");
        const chips = Array.from(row.querySelectorAll<HTMLElement>(".svc-chip"));
        const enter = () => {
          gsap.to(row,   { backgroundColor: "#E4E0D3", duration: 0.65, ease: "expo.out" });
          gsap.to(grid,  { x: 10, duration: 0.65, ease: "expo.out" });
          gsap.to(arrow, { opacity: 1, x: 0, backgroundColor: "#2B41E5", borderColor: "#2B41E5", color: "#F1EEE5", duration: 0.55, ease: "expo.out" });
          gsap.to(chips, { borderColor: "#B9B5A8", color: "#3A3A40", duration: 0.45, ease: "expo.out", stagger: 0.025 });
        };
        const leave = () => {
          gsap.to(row,   { backgroundColor: "transparent", duration: 0.75, ease: "expo.out" });
          gsap.to(grid,  { x: 0, duration: 0.75, ease: "expo.out" });
          gsap.to(arrow, { opacity: 0, x: -8, backgroundColor: "transparent", borderColor: "#B9B5A8", color: "#0E0E12", duration: 0.55, ease: "expo.out" });
          gsap.to(chips, { borderColor: "#DAD6CB", color: "#6B6B72", duration: 0.45, ease: "expo.out", stagger: 0.02 });
        };
        row.addEventListener("mouseenter", enter);
        row.addEventListener("mouseleave", leave);
        rowCleanups.push(() => { row.removeEventListener("mouseenter", enter); row.removeEventListener("mouseleave", leave); });
      });
    }

    let magCleanup: (() => void) | null = null;
    const mag = magneticRef.current;
    if (mag && pointerFine && !reducedMotion) {
      const btn = mag.querySelector<HTMLElement>(".btn-fill");
      if (btn) {
        const r0     = mag.getBoundingClientRect();
        const docCx  = r0.left + window.scrollX + r0.width  / 2;
        const docCy  = r0.top  + window.scrollY + r0.height / 2;
        const radius = Math.max(r0.width, r0.height) * 0.75;
        let active = false;
        const onDocMove = (e: MouseEvent) => {
          const dx = e.clientX - (docCx - window.scrollX);
          const dy = e.clientY - (docCy - window.scrollY);
          if (Math.sqrt(dx * dx + dy * dy) < radius) {
            if (!active) { active = true; btn.classList.add("mag-active"); }
          } else if (active) { active = false; btn.classList.remove("mag-active"); }
        };
        document.addEventListener("mousemove", onDocMove);
        magCleanup = () => { document.removeEventListener("mousemove", onDocMove); btn.classList.remove("mag-active"); };
      }
    }

    return () => { ctx.revert(); rowCleanups.forEach((fn) => fn()); magCleanup?.(); };
  }, []);

  return (
    <>
      <main>
        {/* Header */}
        <header className="svc-header" style={{ padding: "clamp(140px,20vh,210px) var(--gutter) clamp(40px,6vh,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graphite)", marginBottom: "clamp(20px,3vh,30px)" }}>
            <span style={{ width: "34px", height: "1px", background: "var(--ds-graph-300)", display: "inline-block" }} />
            {t("eyebrow")}
          </div>
          <h1 className="svc-h1" style={{ fontWeight: 600, fontSize: "clamp(64px,12vw,120px)", lineHeight: 0.9, letterSpacing: "-0.05em" }}>
            {t("h1")}
          </h1>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "30px", flexWrap: "wrap", marginTop: "clamp(24px,4vh,40px)", borderTop: "1px solid var(--ds-rule)", paddingTop: "22px" }}>
            <p className="svc-sub" style={{ fontSize: "clamp(19px,1.7vw,26px)", letterSpacing: "-0.01em", color: "var(--ds-ink)" }}>
              {t("whatWeDo")}
            </p>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
              {t("disciplines")}
            </span>
          </div>
        </header>

        {/* Services list */}
        <section aria-label="Our services" style={{ padding: "0 var(--gutter) clamp(20px,3vh,40px)" }}>
          {services.map((svc, i) => (
            <Link
              key={svc.no}
              href="/contact"
              data-reveal
              aria-label={`${svc.name} — ${t("ctaBtn")}`}
              className="svc-row"
              style={{ position: "relative", display: "block", width: "100%", textDecoration: "none", color: "inherit", borderTop: "1px solid var(--ds-rule)", borderBottom: i === services.length - 1 ? "1px solid var(--ds-rule)" : "none", padding: "clamp(34px,5vh,56px) clamp(18px,2.4vw,40px)" }}
            >
              <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "auto minmax(0,0.42fr) minmax(0,0.58fr) auto", alignItems: "start", gap: "clamp(20px,4vw,64px)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(13px,1.1vw,15px)", letterSpacing: ".06em", color: "var(--ds-cobalto)", paddingTop: ".5em" }}>
                  {svc.no}
                </span>
                <h2 className="svc-name" style={{ fontWeight: 600, fontSize: "clamp(30px,4vw,56px)", letterSpacing: "-0.04em", lineHeight: 0.96, transition: "transform .4s cubic-bezier(.22,1,.36,1)" }}>
                  {svc.name}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(18px,2.4vh,26px)", paddingTop: "6px" }}>
                  <p style={{ fontSize: "clamp(16px,1.25vw,19px)", lineHeight: 1.55, color: "var(--ds-ink-700)", maxWidth: "42ch" }}>
                    {svc.desc}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 10px", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graph-300)", marginRight: "4px" }}>
                      {t("deliverables")}
                    </span>
                    {svc.chips.map((chip) => (
                      <span key={chip} className="svc-chip" style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", letterSpacing: ".03em", color: "var(--ds-graphite)", border: "1px solid var(--ds-rule)", borderRadius: "999px", padding: "6px 13px", background: "rgba(241,238,229,.4)", transition: "border-color .3s ease, color .3s ease" }}>
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="svc-arrow" style={{ justifySelf: "end", alignSelf: "center", width: "48px", height: "48px", borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid var(--ds-graph-300)", color: "var(--ds-ink)", fontSize: "16px", flexShrink: 0, opacity: 0, transform: "translateX(-8px)", transition: "opacity .4s cubic-bezier(.22,1,.36,1), transform .4s cubic-bezier(.22,1,.36,1), background-color .3s ease, color .3s ease, border-color .3s ease" }}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* CTA */}
        <section aria-label="Start a project" data-reveal style={{ padding: "clamp(80px,13vh,150px) var(--gutter) clamp(90px,14vh,160px)", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ds-graphite)", marginBottom: "clamp(28px,4vh,42px)" }}>
            <span style={{ width: "30px", height: "1px", background: "var(--ds-graph-300)", display: "inline-block" }} />
            {t("ctaLetsBuild")}
            <span style={{ width: "30px", height: "1px", background: "var(--ds-graph-300)", display: "inline-block" }} />
          </div>
          <h2 className="scta-h2" style={{ fontWeight: 600, fontSize: "clamp(40px,6.5vw,88px)", lineHeight: 1, letterSpacing: "-0.045em", maxWidth: "16ch", margin: "0 auto" }}>
            {t("ctaReadyStart")}
          </h2>
          <p style={{ margin: "clamp(22px,3.4vh,32px) auto 0", fontSize: "clamp(16px,1.25vw,19px)", lineHeight: 1.5, color: "var(--ds-graphite)", maxWidth: "44ch" }}>
            {t("ctaSub")}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "22px", marginTop: "clamp(34px,5vh,52px)", flexWrap: "wrap" }}>
            <span className="magnetic" ref={magneticRef}>
              <Link href="/contact" className="btn-fill" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".05em", textTransform: "uppercase", background: "var(--ds-cobalto)", color: "var(--ds-paper)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", padding: "17px 26px", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
                <span className="btn-fill__label" style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  {t("ctaBtn")}
                </span>
              </Link>
            </span>
            <a href="mailto:hey@draftstudio.mx" className="scta-mail" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".03em", color: "var(--ds-ink)", textDecoration: "none", position: "relative", padding: "6px 2px" }}>
              hey@draftstudio.mx
            </a>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .svc-grid  { will-change: transform; }
        .svc-arrow { will-change: transform, opacity, background-color; }
        .btn-fill::before { content: ""; position: absolute; inset: 0; background: var(--ds-ink); transform: translateY(101%); transition: transform .45s cubic-bezier(.22,1,.36,1); z-index: 1; }
        .btn-fill:hover::before { transform: translateY(0); }
        .magnetic .btn-fill.mag-active::before { transform: translateY(0) !important; }
        .scta-mail::after { content: ""; position: absolute; left: 2px; right: 2px; bottom: 0; height: 1px; background: var(--ds-ink); transform: scaleX(0); transform-origin: left; transition: transform .4s cubic-bezier(.22,1,.36,1); }
        .scta-mail:hover::after { transform: scaleX(1); }
        @media (max-width: 900px) { .svc-grid { grid-template-columns: 1fr !important; gap: 18px !important; } .svc-arrow { display: none !important; } }
        @media (max-width: 768px) { .svc-header { padding: 130px var(--gutter) 48px !important; } .svc-h1 { font-size: 96px !important; } .svc-sub { font-size: 24px !important; } .svc-row { padding: 46px 0 !important; } .svc-grid { grid-template-columns: 1fr !important; gap: 20px !important; } .svc-arrow { display: none !important; } .svc-name { font-size: 44px !important; } .scta-h2 { font-size: 64px !important; } }
        @media (max-width: 480px) { .svc-h1 { font-size: 60px !important; } .svc-name { font-size: 34px !important; } .scta-h2 { font-size: 44px !important; } }
      `}</style>
    </>
  );
}
