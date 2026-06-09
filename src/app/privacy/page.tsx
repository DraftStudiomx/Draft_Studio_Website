"use client";

import React from "react";
import Footer from "@/components/layout/Footer";
import { useLocale } from "next-intl";

type Section = { head: string; body?: string; bodyAfter?: string; list?: string[]; email?: boolean };

const content = {
  en: {
    eyebrow: "Updated at 06.2026",
    tag: "Privacy Notice · EN",
    meta: "Updated: June 2026",
    title: "Privacy Notice",
    intro: "Draft Studio, located in León, Guanajuato, Mexico (hereinafter \"the Controller\"), is responsible for the processing of your personal data in accordance with Mexico's Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP).",
    sections: [
      {
        head: "What data do we collect?",
        body: "Through the contact form on this website, we collect:",
        list: ["Name", "Email address", "Company name (optional)", "Project description"],
      },
      {
        head: "How do we use your data?",
        body: "The data collected is used exclusively to:",
        list: ["Respond to your contact request", "Follow up on potential collaboration projects", "Send information related to Draft Studio's services"],
        bodyAfter: "Your data will not be shared, sold, or transferred to third parties without your explicit consent.",
      },
      {
        head: "How long do we keep your data?",
        body: "Your data will be retained only for as long as necessary to address your request and, where applicable, for the duration of the business relationship.",
      },
      {
        head: "ARCO Rights",
        body: "You have the right to Access, Rectify, Cancel, or Object to the processing of your personal data. To exercise these rights, contact us at: ",
        email: true,
      },
      {
        head: "Changes to this notice",
        body: "Draft Studio reserves the right to modify this notice at any time. Any changes will be published on this page.",
      },
    ] as Section[],
  },
  es: {
    eyebrow: "Actualizado 06.2026",
    tag: "Aviso de Privacidad · ES",
    meta: "Actualizado: Junio 2026",
    title: "Aviso de Privacidad",
    intro: "Draft Studio, con domicilio en León, Guanajuato, México (en adelante \"el Responsable\"), es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).",
    sections: [
      {
        head: "¿Qué datos recopilamos?",
        body: "A través del formulario de contacto de este sitio web recopilamos:",
        list: ["Nombre", "Correo electrónico", "Nombre de empresa (opcional)", "Descripción del proyecto"],
      },
      {
        head: "¿Para qué usamos sus datos?",
        body: "Los datos recopilados se utilizan exclusivamente para:",
        list: ["Responder a su solicitud de contacto", "Dar seguimiento a posibles proyectos de colaboración", "Enviar información relacionada con los servicios de Draft Studio"],
        bodyAfter: "Sus datos no serán compartidos, vendidos ni transferidos a terceros sin su consentimiento expreso.",
      },
      {
        head: "¿Cuánto tiempo conservamos sus datos?",
        body: "Sus datos serán conservados únicamente durante el tiempo necesario para atender su solicitud y, en su caso, durante la vigencia de la relación comercial.",
      },
      {
        head: "Derechos ARCO",
        body: "Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (Derechos ARCO). Para ejercerlos, escríbanos a: ",
        email: true,
      },
      {
        head: "Cambios a este aviso",
        body: "Draft Studio se reserva el derecho de modificar este aviso en cualquier momento. Cualquier cambio será publicado en esta página.",
      },
    ] as Section[],
  },
};

const S = {
  secHead: {
    fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em",
    textTransform: "uppercase" as const, color: "var(--ds-graphite)",
    paddingBottom: "13px", borderBottom: "1px solid var(--ds-rule)",
  },
  body: { fontSize: "16px", lineHeight: 1.7, color: "var(--ds-ink)" } as React.CSSProperties,
  listItem: { position: "relative" as const, paddingLeft: "26px", fontSize: "16px", lineHeight: 1.6, color: "var(--ds-ink)" },
};

export default function PrivacyPage() {
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
            {c.title}
          </h1>

          <section aria-label="Privacy Notice" style={{ marginTop: "clamp(46px,7vh,72px)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ds-cobalto)" }}>
              {c.tag}
            </div>
            <p style={{ marginTop: "12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".04em", color: "var(--ds-graphite)" }}>
              {c.meta}
            </p>
            <p style={{ ...S.body, marginTop: "18px" }}>{c.intro}</p>

            {c.sections.map((sec) => (
              <div key={sec.head} style={{ marginTop: "clamp(40px,6vh,56px)" }}>
                <h2 style={S.secHead}>{sec.head}</h2>

                {sec.body && (
                  <p style={{ ...S.body, marginTop: "20px" }}>
                    {sec.body}
                    {sec.email && (
                      <a href="mailto:hey@draftstudio.mx" className="legal-inline">
                        hey@draftstudio.mx
                      </a>
                    )}
                  </p>
                )}

                {sec.list && (
                  <ul style={{ marginTop: "16px", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {sec.list.map((item) => (
                      <li key={item} style={S.listItem} className="legal-li">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {sec.bodyAfter && (
                  <p style={{ ...S.body, marginTop: "16px" }}>{sec.bodyAfter}</p>
                )}
              </div>
            ))}
          </section>

        </div>
      </main>

      <Footer />

      <style>{`
        .legal-inline { color: var(--ds-cobalto); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color .25s ease; }
        .legal-inline:hover { border-bottom-color: var(--ds-cobalto); }
        .legal-li::before { content: "—"; position: absolute; left: 0; top: 0; color: var(--ds-graphite); }
      `}</style>
    </>
  );
}
