"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  pathname: string;
}

export default function NavDrawer({ open, onClose, links, pathname }: NavDrawerProps) {
  const locale       = useLocale();
  const router       = useRouter();
  const intlPathname = usePathname();

  function switchLocale(next: "es" | "en") {
    router.replace(intlPathname, { locale: next });
    onClose();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        id="navDrawer"
        inert={!open ? true : undefined}
        className={`nav-drawer${open ? " is-open" : ""}`}
      >
        {/* Scrim */}
        <div className="nav-drawer__scrim" onClick={onClose} aria-hidden="true" />

        {/* Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="nav-drawer__panel"
        >
          <div className="nav-drawer__top">
            <span className="nav-drawer__brand">Draft Studio</span>
            <button type="button" onClick={onClose} className="nav-drawer__close">
              Close
            </button>
          </div>

          <nav className="nav-drawer__links" aria-label="Primary">
            {links.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`nav-drawer__link${active ? " is-active" : ""}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Language switcher */}
          <div className="nav-drawer__lang">
            <button
              type="button"
              onClick={() => switchLocale("en")}
              className={`nav-drawer__lang-btn${locale === "en" ? " is-active" : ""}`}
            >
              EN
            </button>
            <span className="nav-drawer__lang-sep">/</span>
            <button
              type="button"
              onClick={() => switchLocale("es")}
              className={`nav-drawer__lang-btn${locale === "es" ? " is-active" : ""}`}
            >
              ES
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        .nav-drawer {
          position: fixed; inset: 0; z-index: 999;
          pointer-events: none;
        }
        .nav-drawer.is-open { pointer-events: auto; }

        .nav-drawer__scrim {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.7);
          opacity: 0; transition: opacity 0.35s ease;
        }
        .nav-drawer.is-open .nav-drawer__scrim { opacity: 1; }

        .nav-drawer__panel {
          position: absolute; top: 0; right: 0;
          height: 100vh; width: 75%; max-width: 280px;
          background: var(--ds-ink);
          display: flex; flex-direction: column;
          padding: 22px 24px 40px;
          box-shadow: -24px 0 60px -30px rgba(0,0,0,0.7);
          transform: translateX(100%);
          transition: transform 0.42s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-drawer.is-open .nav-drawer__panel { transform: translateX(0); }

        .nav-drawer__top {
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-drawer__brand {
          font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--ds-graphite);
        }
        .nav-drawer__close {
          font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ds-paper); background: none; border: 0; cursor: pointer; padding: 0;
        }
        .nav-drawer__links {
          flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 8px;
        }
        .nav-drawer__link {
          font-family: var(--font-geist-sans); font-weight: 500;
          font-size: 48px; line-height: 1.1; letter-spacing: -0.03em;
          color: var(--ds-paper); text-decoration: none;
          width: max-content; transition: color 0.25s ease;
        }
        .nav-drawer__link:hover,
        .nav-drawer__link.is-active { color: var(--ds-cobalto); }

        .nav-drawer__lang {
          display: flex; align-items: center; gap: 10px;
          padding-top: 24px; border-top: 1px solid var(--ds-ink-700);
        }
        .nav-drawer__lang-btn {
          font-family: var(--font-mono); font-size: 13px;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ds-graphite); background: none; border: 0;
          cursor: pointer; padding: 0; transition: color 0.25s ease;
        }
        .nav-drawer__lang-btn.is-active { color: var(--ds-paper); }
        .nav-drawer__lang-btn:hover { color: var(--ds-cobalto); }
        .nav-drawer__lang-sep {
          font-family: var(--font-mono); font-size: 12px;
          color: var(--ds-ink-700);
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-drawer__panel, .nav-drawer__scrim { transition: none; }
        }

        @media (min-width: 769px) {
          .nav-drawer { display: none; }
        }
      `}</style>
    </>
  );
}
