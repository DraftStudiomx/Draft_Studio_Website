"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import NavDrawer from "./NavDrawer";

const navLinks = [
  { labelKey: "work",     href: "/work" },
  { labelKey: "studio",   href: "/studio" },
  { labelKey: "services", href: "/services" },
  { labelKey: "contact",  href: "/contact" },
] as const;

export default function Nav() {
  const [scrolled, setScrolled]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navRef                       = useRef<HTMLElement>(null);
  const locale                       = useLocale();
  const t                            = useTranslations("nav");
  const router                       = useRouter();
  const pathname                     = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  function switchLocale(next: "es" | "en") {
    router.replace(pathname, { locale: next });
  }

  const links = navLinks.map((l) => ({ label: t(l.labelKey), href: l.href }));

  return (
    <>
      <nav
        ref={navRef}
        className={`nav ${scrolled ? "is-scrolled" : ""}`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="nav__logo"
          aria-label="Draft Studio home"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image
            src="/logo-color.svg"
            alt="Draft Studio"
            width={180}
            height={45}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="nav__links">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav__link${active ? " is-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link href="/contact" className="nav__cta">
            {t("cta")}
          </Link>

          <div className="nav__lang" role="group" aria-label="Language">
            <span
              role="button"
              tabIndex={0}
              aria-pressed={locale === "es"}
              className={locale === "es" ? "is-active" : ""}
              onClick={() => switchLocale("es")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && switchLocale("es")}
            >ES</span>
            <span
              role="button"
              tabIndex={0}
              aria-pressed={locale === "en"}
              className={locale === "en" ? "is-active" : ""}
              onClick={() => switchLocale("en")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && switchLocale("en")}
            >EN</span>
          </div>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="nav__mobile">
          <Link href="/contact" className="nav__cta">
            {t("cta")}
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="nav__hamburger"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={links}
        pathname={pathname}
      />

      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 26px var(--gutter);
          transition: background 0.35s ease, padding 0.35s ease, border-color 0.35s ease;
          border-bottom: 1px solid transparent;
        }
        .nav.is-scrolled {
          background: rgba(241,238,229,0.90);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding-top: 16px; padding-bottom: 16px;
          border-bottom-color: var(--ds-rule);
        }
        .nav__logo { display: flex; align-items: center; height: 34px; }
        .nav__logo img { height: 34px; width: auto; }

        /* Desktop links */
        .nav__links { display: flex; align-items: center; gap: 38px; }
        .nav__link {
          font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ds-ink); text-decoration: none;
          position: relative; transition: color 0.25s ease;
        }
        .nav__link::after {
          content: ""; position: absolute; left: 0; bottom: -5px;
          height: 1px; width: 0; background: var(--ds-cobalto);
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .nav__link:hover, .nav__link.is-active { color: var(--ds-cobalto); }
        .nav__link:hover::after, .nav__link.is-active::after { width: 100%; }

        .nav__cta {
          font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ds-cobalto); text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .nav__lang {
          display: flex; gap: 10px;
          font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em;
        }
        .nav__lang span { color: var(--ds-graphite); cursor: pointer; transition: color .2s ease; }
        .nav__lang span:hover { color: var(--ds-ink); }
        .nav__lang span.is-active { color: var(--ds-ink); }

        /* Mobile */
        .nav__mobile { display: none; align-items: center; gap: 18px; }
        .nav__hamburger {
          display: flex; flex-direction: column; justify-content: center; gap: 5px;
          width: 22px; height: 16px; padding: 0;
          background: none; border: 0; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .nav__hamburger span {
          display: block; width: 20px; height: 2px;
          background: var(--ds-cobalto); border-radius: 2px;
        }

        @media (max-width: 768px) {
          .nav__links { display: none; }
          .nav__mobile { display: flex; }
        }
      `}</style>
    </>
  );
}
