"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export default function Footer() {
  const t        = useTranslations("footer");
  const nav      = useTranslations("nav");
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <footer
      style={{
        background: "var(--ds-ink)",
        color: "var(--ds-paper)",
        padding: "clamp(48px,7vh,104px) var(--gutter) 0",
      }}
    >
      {/* Grid */}
      <div
        className="footer__grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gap: "40px",
          paddingBottom: "clamp(50px,7vh,84px)",
        }}
      >
        {/* Brand */}
        <div className="footer__brand">
          <Link
            href="/"
            aria-label="Draft Studio home"
            style={{ display: "inline-block" }}
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                router.refresh();
              }
            }}
          >
            <svg viewBox="0 0 360 90" fill="none" role="img" aria-label="Draft Studio" style={{ height: "30px", width: "auto", display: "block" }}>
              <g stroke="#F1EEE5" strokeWidth="2.2" fill="none" strokeLinecap="square">
                <path d="M10 22V10H22" />
                <path d="M70 10H82V22" />
                <path d="M82 68V80H70" />
                <path d="M22 80H10V68" />
              </g>
              <path d="M28 25H45.5C55.165 25 63 32.835 63 42.5V47.5C63 57.165 55.165 65 45.5 65H28V25Z" stroke="#F1EEE5" strokeWidth="2.6" fill="none" />
              <text x="105" y="58" fontFamily="Geist, system-ui, sans-serif" fontWeight="500" fontSize="36" letterSpacing="-1.4" fill="#F1EEE5">Draft Studio</text>
            </svg>
          </Link>
          <p
            style={{
              marginTop: "18px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: ".04em",
              color: "var(--ds-graphite)",
            }}
          >
            {t("tagline")}
          </p>
        </div>

        {/* Menu */}
        <div>
          <div className="footer__coltitle">{t("menu")}</div>
          <nav className="footer__nav">
            <Link href="/work"     className="footer__link">{nav("work")}</Link>
            <Link href="/services" className="footer__link">{nav("services")}</Link>
            <Link href="/studio"   className="footer__link">{nav("studio")}</Link>
            <Link href="/contact"  className="footer__link">{nav("contact")}</Link>
          </nav>
        </div>

        {/* Connect */}
        <div>
          <div className="footer__coltitle">{t("connect")}</div>
          <Link href="/contact" className="footer__cta">{t("start")}</Link>
          <nav className="footer__nav">
            <a href="https://instagram.com/draftstudio.mx" className="footer__link" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com/company/draftstudio" className="footer__link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://facebook.com/draftstudio" className="footer__link" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://wa.me/524424850730" className="footer__link" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </nav>
        </div>
      </div>

      <style>{`
        .footer__coltitle {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .14em; text-transform: uppercase;
          color: var(--ds-graphite); margin-bottom: 20px;
        }
        .footer__nav { display: flex; flex-direction: column; gap: 12px; }
        .footer__link {
          font-family: var(--font-mono); font-size: 13px;
          letter-spacing: .04em; color: var(--ds-paper);
          text-decoration: none; transition: color .25s ease;
        }
        .footer__link:hover { color: var(--ds-cobalto); }
        .footer__cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 13px;
          letter-spacing: .04em; text-transform: uppercase;
          color: var(--ds-cobalto); text-decoration: none;
          margin-bottom: 20px; transition: opacity .25s ease;
        }
        .footer__cta:hover { opacity: .7; }
        .footer__bottom {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; border-top: 1px solid rgba(241,238,229,.1);
          padding: 22px 0 30px;
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .08em; color: var(--ds-graphite);
        }
        .footer__bottom-link { color: var(--ds-graphite); text-decoration: none; transition: color .25s ease; }
        .footer__bottom-link:hover { color: var(--ds-cobalto); }

        @media (max-width: 768px) {
          .footer__grid { grid-template-columns: 1fr 1fr !important; }
          .footer__brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer__grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .footer__brand { grid-column: auto; }
          .footer__bottom { flex-direction: column; align-items: flex-start; gap: 10px; }
          .footer__cta { font-size: 14px; }
          .footer__topbar { flex-direction: column; align-items: flex-start; gap: 4px; }
        }
      `}</style>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span>{t("rights")}</span>
        <span>
          <Link href="/privacy" className="footer__bottom-link">{t("privacy")}</Link>
          {" · "}
          <Link href="/terms" className="footer__bottom-link">{t("terms")}</Link>
        </span>
      </div>
    </footer>
  );
}
