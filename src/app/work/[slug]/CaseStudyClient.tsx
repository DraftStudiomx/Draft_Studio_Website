"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/layout/Footer";
import { urlFor } from "@/sanity/lib/image";
import { useLocale, useTranslations } from "next-intl";

interface CaseStudy {
  slug: string;
  idx: string;
  client: string;
  category: string;
  year: string;
  liveUrl: string;
  liveName: string;
  heroTag: string;
  challenge: string;
  approach: string[];
  solutionCaption: string;
  heroImage?: { asset: { _ref: string } };
  solutionImage?: { asset: { _ref: string } };
  nextSlug: string;
  nextName: string;
}

export default function CaseStudyClient({ cs }: { cs: CaseStudy }) {
  const t      = useTranslations("case");
  const locale = useLocale();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (!els.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(els, { opacity: 0, y: 36 });
      ScrollTrigger.batch(els, {
        start: "top 88%",
        onEnter: (targets) => {
          gsap.to(targets, { opacity: 1, y: 0, duration: 0.85, ease: "expo.out", stagger: 0.1, overwrite: true });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const workHref = locale === "en" ? "/en/work" : "/work";

  return (
    <>
      <article aria-label={`Case study: ${cs.client}`} style={{ paddingTop: "clamp(132px,18vh,196px)" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 var(--gutter)", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ds-graphite)", marginBottom: "clamp(26px,4vh,44px)" }}>
          <Link href={workHref} className="cs-crumb-link" style={{ color: "var(--ds-graphite)", textDecoration: "none" }}>
            {t("breadcrumb")}
          </Link>
          <span style={{ color: "var(--ds-graph-300)" }}>/</span>
          <span style={{ color: "var(--ds-ink)" }}>{cs.client}</span>
        </div>

        {/* Hero */}
        <header style={{ padding: "0 var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graphite)", marginBottom: "clamp(18px,3vh,28px)" }}>
            <span style={{ width: "34px", height: "1px", background: "var(--ds-graph-300)", display: "inline-block" }} />
            / {t("caseStudy")} — {cs.idx}
          </div>

          <h1 style={{ fontWeight: 600, fontSize: "clamp(56px,10.5vw,110px)", lineHeight: 0.88, letterSpacing: "-0.05em", maxWidth: "14ch" }}>
            {cs.client}
          </h1>

          {/* Meta grid — responsive 2×2 on mobile */}
          <div className="cs-meta" style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", alignItems: "stretch", marginTop: "clamp(28px,4.5vh,48px)", borderTop: "1px solid var(--ds-rule)", borderBottom: "1px solid var(--ds-rule)" }}>
            {[
              { k: t("labelClient"),   v: cs.client   },
              { k: t("labelCategory"), v: cs.category },
              { k: t("labelYear"),     v: cs.year     },
            ].map((item, i) => (
              <div key={item.k} className="cs-meta-cell" style={{ display: "flex", flexDirection: "column", gap: "7px", padding: "18px clamp(16px,2.4vw,34px) 18px", paddingLeft: i === 0 ? "0" : "clamp(16px,2.4vw,34px)", borderLeft: i > 0 ? "1px solid var(--ds-rule)" : "none" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graph-300)" }}>{item.k}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".03em", color: "var(--ds-graphite)" }}>{item.v}</span>
              </div>
            ))}

            {/* Live */}
            <div className="cs-meta-cell cs-meta-live" style={{ display: "flex", flexDirection: "column", gap: "7px", padding: "18px 0 18px clamp(16px,2.4vw,34px)", marginLeft: "auto", borderLeft: "1px solid var(--ds-rule)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-graph-300)" }}>{t("labelLive")}</span>
              <a href={cs.liveUrl} {...(cs.liveUrl !== "#" && { target: "_blank", rel: "noopener noreferrer" })} className="cs-live-link" style={{ color: "var(--ds-ink)", textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".03em" }}>
                {cs.liveName}
              </a>
            </div>
          </div>

          {/* Hero media */}
          <div data-reveal style={{ marginTop: "clamp(30px,5vh,56px)", aspectRatio: "16 / 9", background: "radial-gradient(120% 130% at 72% 18%, #1b1b22 0%, #0E0E12 62%)", position: "relative", overflow: "hidden" }}>
            {cs.heroImage?.asset ? (
              <Image src={urlFor(cs.heroImage).width(2400).quality(95).url()} alt={`${cs.client} — hero`} fill style={{ objectFit: "cover" }} sizes="100vw" priority />
            ) : (
              <span style={{ position: "absolute", right: "20px", top: "18px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".12em", color: "rgba(241,238,229,.32)" }}>[ Image · 16:9 ]</span>
            )}
            <span style={{ position: "absolute", left: "20px", bottom: "18px", zIndex: 1, fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".12em", color: "rgba(241,238,229,.5)" }}>
              {cs.heroTag}
            </span>
          </div>
        </header>

        {/* Body */}
        <div style={{ padding: "clamp(70px,11vh,128px) var(--gutter) 0" }}>

          {/* 01 Challenge */}
          <section data-reveal className="cs-grid-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0,.34fr) minmax(0,.66fr)", gap: "clamp(24px,5vw,80px)", paddingBottom: "clamp(46px,7vh,76px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", color: "var(--ds-graph-300)" }}>01</span>
              <h2 style={{ fontWeight: 600, fontSize: "clamp(26px,3vw,40px)", letterSpacing: "-0.03em", lineHeight: 1 }}>{t("challenge")}</h2>
            </div>
            <div style={{ maxWidth: "60ch" }}>
              <p style={{ fontSize: "clamp(20px,1.8vw,27px)", lineHeight: 1.5, color: "var(--ds-ink)", letterSpacing: "-0.01em" }}>{cs.challenge}</p>
            </div>
          </section>

          {/* 02 Approach */}
          <section data-reveal className="cs-grid-sec" style={{ display: "grid", gridTemplateColumns: "minmax(0,.34fr) minmax(0,.66fr)", gap: "clamp(24px,5vw,80px)", padding: "clamp(46px,7vh,76px) 0", borderTop: "1px solid var(--ds-rule)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", color: "var(--ds-graph-300)" }}>02</span>
              <h2 style={{ fontWeight: 600, fontSize: "clamp(26px,3vw,40px)", letterSpacing: "-0.03em", lineHeight: 1 }}>{t("approach")}</h2>
            </div>
            <div style={{ maxWidth: "60ch", display: "flex", flexDirection: "column", gap: "clamp(18px,2.4vh,28px)" }}>
              {cs.approach.map((para, i) => (
                <p key={i} style={{ fontSize: "clamp(17px,1.35vw,21px)", lineHeight: 1.62, color: "var(--ds-ink-700)" }}>{para}</p>
              ))}
            </div>
          </section>

          {/* 03 Solution */}
          <section data-reveal style={{ padding: "clamp(46px,7vh,76px) 0", borderTop: "1px solid var(--ds-rule)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(24px,5vw,80px)", marginBottom: "clamp(26px,4vh,40px)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", color: "var(--ds-graph-300)" }}>03</span>
              <h2 style={{ fontWeight: 600, fontSize: "clamp(26px,3vw,40px)", letterSpacing: "-0.03em", lineHeight: 1 }}>{t("solution")}</h2>
            </div>
            <div style={{ aspectRatio: "16 / 8.4", background: "radial-gradient(120% 130% at 30% 20%, #1b1b22 0%, #0E0E12 60%)", position: "relative", overflow: "hidden" }}>
              {cs.solutionImage?.asset ? (
                <Image src={urlFor(cs.solutionImage).width(2400).quality(95).url()} alt={`${cs.client} — solution`} fill style={{ objectFit: "cover" }} sizes="100vw" />
              ) : (
                <span style={{ position: "absolute", right: "20px", top: "18px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".12em", color: "rgba(241,238,229,.32)" }}>[ Image · full width ]</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".05em", color: "var(--ds-graphite)" }}>
              <span style={{ color: "var(--ds-graph-300)" }}>{t("figCaption")}</span>
              <span>{cs.solutionCaption}</span>
            </div>
          </section>

        </div>

        {/* Next project */}
        <div style={{ margin: "clamp(70px,11vh,128px) var(--gutter) 0", borderTop: "1px solid var(--ds-rule)" }}>
          <Link href={`/work/${cs.nextSlug}`} className="cs-next-link" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "clamp(20px,4vw,56px)", padding: "clamp(40px,7vh,72px) 0 clamp(80px,11vh,120px)", textDecoration: "none", color: "inherit" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
              {t("nextProject")}
            </span>
            <span className="cs-next-name" style={{ display: "inline-flex", alignItems: "baseline", gap: "18px", fontWeight: 600, fontSize: "clamp(30px,4.4vw,58px)", letterSpacing: "-0.04em", lineHeight: 1, transition: "color .3s ease" }}>
              {cs.nextName}
              <span className="cs-next-arrow" style={{ fontFamily: "var(--font-mono)", fontWeight: 400, color: "var(--ds-graphite)", fontSize: ".5em", transform: "translateY(-.18em)", display: "inline-block", transition: "transform .4s cubic-bezier(.16,1,.3,1), color .3s ease" }}>→</span>
            </span>
          </Link>
        </div>

      </article>

      <Footer />

      <style>{`
        .cs-crumb-link:hover { color: var(--ds-cobalto) !important; }
        .cs-live-link:hover  { color: var(--ds-cobalto) !important; }
        .cs-next-link:hover .cs-next-name  { color: var(--ds-cobalto); }
        .cs-next-link:hover .cs-next-arrow { transform: translate(10px, -.18em) !important; color: var(--ds-cobalto); }

        /* Meta grid responsive */
        .cs-meta { width: 100%; }
        @media (max-width: 600px) {
          .cs-meta {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
          }
          .cs-meta-cell {
            padding: 16px 14px !important;
            border-left: none !important;
            border-top: 1px solid var(--ds-rule);
          }
          .cs-meta-cell:nth-child(1) { border-top: none; padding-left: 0 !important; }
          .cs-meta-cell:nth-child(2) { border-top: none; border-left: 1px solid var(--ds-rule) !important; }
          .cs-meta-live {
            margin-left: 0 !important;
            border-left: 1px solid var(--ds-rule) !important;
          }
        }

        /* Content sections */
        @media (max-width: 860px) {
          .cs-grid-sec { grid-template-columns: 1fr !important; gap: clamp(14px, 2vh, 22px) !important; }
        }

        /* WorkPreview card image on mobile */
        @media (max-width: 768px) {
          .work-card__media { aspect-ratio: 4/3 !important; }
        }
        @media (max-width: 480px) {
          .work-card__media { aspect-ratio: 3/2 !important; }
          .cs-grid-sec { gap: 14px !important; }
        }
      `}</style>
    </>
  );
}
