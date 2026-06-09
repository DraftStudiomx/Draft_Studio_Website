"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import CustomCursor from "@/components/ui/CustomCursor";

const copy = {
  en: {
    eyebrow: "/ Error — 404",
    h1: "Page not found.",
    sub: "The page you're looking for doesn't exist or was moved.",
    btn: "Go home →",
    work: "View our work →",
  },
  es: {
    eyebrow: "/ Error — 404",
    h1: "Página no encontrada.",
    sub: "La página que buscas no existe o fue movida.",
    btn: "Ir al inicio →",
    work: "Ver proyectos →",
  },
};

export default function NotFoundClient() {
  const pathname    = usePathname();
  const isEn        = pathname?.startsWith("/en");
  const c           = isEn ? copy.en : copy.es;
  const magneticRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-nf]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(els, { opacity: 1, y: 0 });
    } else {
      const tween = gsap.fromTo(
        els,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, delay: 0.05 }
      );
      /* tween cleanup handled by returning kill fn */
      const mag = magneticRef.current;
      if (mag && window.matchMedia("(pointer: fine)").matches) {
        const btn = mag.querySelector<HTMLElement>(".btn-fill");
        if (!btn) return () => {};

        let docCleanup: (() => void) | null = null;

        /* Esperar a que la animación de entrada termine para capturar posición correcta */
        tween.then(() => {
          const r0     = mag.getBoundingClientRect();
          const cx     = r0.left + r0.width  / 2;
          const cy     = r0.top  + r0.height / 2;
          const radius = Math.max(r0.width, r0.height) * 0.75;

          let active = false;
          const onDocMove = (e: MouseEvent) => {
            const dx   = e.clientX - cx;
            const dy   = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius) {
              if (!active) {
                active = true;
                btn.classList.add("mag-active");
                gsap.to(btn, { color: "#0E0E12", duration: 0.25, ease: "none" });
              }
            } else if (active) {
              active = false;
              btn.classList.remove("mag-active");
              gsap.to(btn, { color: "#F1EEE5", duration: 0.25, ease: "none" });
            }
          };
          document.addEventListener("mousemove", onDocMove);
          docCleanup = () => {
            document.removeEventListener("mousemove", onDocMove);
            btn.classList.remove("mag-active");
          };
        });

        return () => {
          tween.kill();
          docCleanup?.();
        };
      }
      return () => { tween.kill(); };
    }
  }, []);

  return (
    <>
      <CustomCursor />
      <style>{`
        body { background: var(--ds-ink) !important; color: var(--ds-paper) !important; }
        .nav { border-bottom-color: var(--ds-ink-700) !important; }
        .nav.is-scrolled { background: rgba(14,14,18,.82) !important; border-bottom-color: var(--ds-ink-700) !important; }
        .nav__link { color: var(--ds-paper) !important; }
        .nav__logo img { filter: brightness(0) invert(1); }
        .nav__lang span { color: var(--ds-graphite) !important; }
        .nav__lang span.is-active { color: var(--ds-paper) !important; }
        .btn-fill::before { content: ""; position: absolute; inset: 0; background: var(--ds-paper); transform: translateY(101%); transition: transform .45s cubic-bezier(.22,1,.36,1); z-index: 1; }
        .btn-fill:hover,
        .btn-fill:active                { color: var(--ds-ink) !important; }
        .btn-fill:hover::before,
        .btn-fill:active::before        { transform: translateY(0); }
        .magnetic .btn-fill.mag-active::before { transform: translateY(0) !important; }
        .magnetic .btn-fill.mag-active { color: var(--ds-ink) !important; }
        .nf-textlink { position: relative; padding-bottom: 4px; }
        .nf-textlink::after { content: ""; position: absolute; left: 0; bottom: 0; height: 1px; width: 0; background: var(--ds-paper); transition: width .3s cubic-bezier(.22,1,.36,1); }
        .nf-textlink:hover::after { width: 100%; }
        @media (max-width: 480px) {
          .nf-main { min-height: auto !important; padding-top: 140px !important; padding-bottom: 60px !important; }
        }
      `}</style>

      <main
        className="nf-main"
        style={{ flex: 1, position: "relative", display: "grid", placeItems: "center", padding: "clamp(130px,20vh,200px) var(--gutter) clamp(90px,14vh,140px)", overflow: "hidden", textAlign: "center", minHeight: "80vh" }}
      >
        {/* Ghost 404 */}
        <span aria-hidden="true" style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -52%)",
          fontWeight: 600, fontSize: "clamp(120px,30vw,200px)",
          lineHeight: 1, letterSpacing: "-0.05em",
          color: "var(--ds-paper)", opacity: 0.08,
          pointerEvents: "none", userSelect: "none", zIndex: 0,
        }}>
          404
        </span>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div data-nf style={{
            display: "flex", alignItems: "center", gap: "14px",
            fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em",
            textTransform: "uppercase", color: "var(--ds-graphite)",
            marginBottom: "clamp(20px,3vh,28px)",
          }}>
            <span style={{ width: "34px", height: "1px", background: "var(--ds-ink-700)", display: "inline-block" }} />
            {c.eyebrow}
          </div>

          <h1 data-nf style={{ fontWeight: 600, fontSize: "clamp(40px,7vw,64px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--ds-paper)" }}>
            {c.h1}
          </h1>

          <p data-nf style={{
            marginTop: "clamp(18px,2.6vh,24px)",
            fontFamily: "var(--font-mono)", fontSize: "clamp(12px,1.05vw,14px)",
            letterSpacing: ".03em", lineHeight: 1.5,
            color: "var(--ds-graphite)", maxWidth: "46ch",
          }}>
            {c.sub}
          </p>

          <div data-nf style={{
            marginTop: "clamp(30px,5vh,46px)",
            display: "flex", alignItems: "center",
            gap: "clamp(20px,3vw,34px)", flexWrap: "wrap", justifyContent: "center",
          }}>
            <span className="magnetic" ref={magneticRef}>
              <Link href="/" className="btn-fill" style={{
                fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".05em",
                textTransform: "uppercase", background: "var(--ds-cobalto)", color: "var(--ds-paper)",
                textDecoration: "none", display: "inline-flex", alignItems: "center",
                gap: "10px", padding: "17px 26px", borderRadius: "3px",
                position: "relative", overflow: "hidden",
              }}>
                <span className="btn-fill__label" style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  {c.btn}
                </span>
              </Link>
            </span>

            <Link href="/work" className="nf-textlink" style={{
              fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".06em",
              textTransform: "uppercase", color: "var(--ds-paper)", textDecoration: "none",
            }}>
              {c.work}
            </Link>
          </div>
        </div>
      </main>

      {/* Minimal footer — outside locale provider, no i18n hooks */}
      <footer style={{ background: "var(--ds-ink)", borderTop: "1px solid rgba(241,238,229,.08)", padding: "22px var(--gutter)", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", color: "var(--ds-graphite)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <span>© 2026 Draft Studio</span>
        <span>draftstudio.mx</span>
      </footer>
    </>
  );
}
