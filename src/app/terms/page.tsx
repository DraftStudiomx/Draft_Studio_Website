"use client";

import Footer from "@/components/layout/Footer";
import { useLocale } from "next-intl";

interface Section {
  head: string;
  body: string;
  email?: boolean;
}

const content = {
  en: {
    eyebrow: "Updated at 06.2026",
    tag: "Terms and Conditions · EN",
    meta: "Updated: June 2026",
    intro: "By accessing and using draftstudio.mx, you agree to these terms and conditions. If you do not agree, please do not use this site.",
    sections: [
      { head: "1. Use of the site",        body: "This website is intended to present the services, projects, and capabilities of Draft Studio. The information published is for informational purposes only and does not constitute a binding offer unless expressly stated through a separate contract." },
      { head: "2. Intellectual property",  body: "All content on this site — including text, images, graphics, logos, designs, code, and interfaces — is the property of Draft Studio or has been licensed for its use. It is protected by applicable copyright and intellectual property laws. Reproduction, distribution, or commercial use without prior written authorization is strictly prohibited." },
      { head: "3. Limitation of liability", body: "Draft Studio does not guarantee the continuous availability or error-free operation of the site. Content is provided \"as is\" and use of the site is at the user's own risk. Draft Studio shall not be liable for any direct or indirect damages arising from the use or inability to use the site." },
      { head: "4. Third-party links",      body: "This site may contain links to third-party websites. Draft Studio is not responsible for the content, policies, or practices of those sites." },
      { head: "5. Modifications",          body: "Draft Studio reserves the right to modify these terms at any time. Changes will take effect upon publication on this site." },
      { head: "6. Contact",                body: "For any questions regarding these terms, contact us at: ", email: true },
    ] as Section[],
  },
  es: {
    eyebrow: "Actualizado 06.2026",
    tag: "Términos y Condiciones · ES",
    meta: "Actualizado: Junio 2026",
    intro: "Al acceder y utilizar el sitio web draftstudio.mx, usted acepta los presentes términos y condiciones. Si no está de acuerdo, le pedimos no utilizar este sitio.",
    sections: [
      { head: "1. Uso del sitio",               body: "Este sitio web tiene como finalidad presentar los servicios, proyectos y capacidades de Draft Studio. La información publicada es de carácter informativo y no constituye una oferta vinculante, salvo que se establezca expresamente mediante un contrato por separado." },
      { head: "2. Propiedad intelectual",        body: "Todo el contenido de este sitio — incluyendo textos, imágenes, gráficos, logotipos, diseños, código e interfaces — es propiedad de Draft Studio o ha sido licenciado para su uso. Está protegido por las leyes de derechos de autor y propiedad industrial aplicables. Queda estrictamente prohibida su reproducción, distribución o uso comercial sin autorización escrita previa." },
      { head: "3. Limitación de responsabilidad", body: "Draft Studio no garantiza la disponibilidad continua ni el funcionamiento sin errores del sitio. El contenido se ofrece \"tal cual\" y el uso del sitio es responsabilidad del usuario. Draft Studio no se hace responsable por daños directos o indirectos derivados del uso o la imposibilidad de uso del sitio." },
      { head: "4. Enlaces a terceros",          body: "Este sitio puede contener enlaces a sitios web de terceros. Draft Studio no se responsabiliza por el contenido, políticas o prácticas de dichos sitios." },
      { head: "5. Modificaciones",              body: "Draft Studio se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en este sitio." },
      { head: "6. Contacto",                    body: "Para cualquier duda relacionada con estos términos, escríbanos a: ", email: true },
    ] as Section[],
  },
};

export default function TermsPage() {
  const locale = useLocale() as "es" | "en";
  const c = content[locale] ?? content.en;

  return (
    <>
      <main style={{ flex: 1, padding: "clamp(140px,18vh,200px) var(--gutter) clamp(72px,10vh,110px)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
            {c.eyebrow}
          </div>

          <h1 style={{ marginTop: "clamp(18px,2.6vh,26px)", fontWeight: 600, fontSize: "clamp(40px,8vw,64px)", lineHeight: 0.96, letterSpacing: "-0.04em" }}>
            {locale === "en" ? "Terms and Conditions" : "Términos y Condiciones"}
          </h1>

          <section aria-label="Terms and Conditions" style={{ marginTop: "clamp(46px,7vh,72px)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-cobalto)" }}>
              {c.tag}
            </div>
            <p style={{ marginTop: "12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".04em", color: "var(--ds-graphite)" }}>
              {c.meta}
            </p>
            <p style={{ marginTop: "18px", fontSize: "16px", lineHeight: 1.7, color: "var(--ds-ink)" }}>
              {c.intro}
            </p>

            {c.sections.map((sec) => (
              <div key={sec.head} style={{ marginTop: "clamp(40px,6vh,56px)" }}>
                <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ds-graphite)", paddingBottom: "13px", borderBottom: "1px solid var(--ds-rule)" }}>
                  {sec.head}
                </h2>
                <p style={{ marginTop: "20px", fontSize: "16px", lineHeight: 1.7, color: "var(--ds-ink)" }}>
                  {sec.body}
                  {sec.email && (
                    <a href="mailto:hey@draftstudio.mx" className="legal-inline">
                      hey@draftstudio.mx
                    </a>
                  )}
                </p>
              </div>
            ))}
          </section>

        </div>
      </main>

      <Footer />

      <style>{`
        .legal-inline { color: var(--ds-cobalto); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color .25s ease; }
        .legal-inline:hover { border-bottom-color: var(--ds-cobalto); }
      `}</style>
    </>
  );
}
