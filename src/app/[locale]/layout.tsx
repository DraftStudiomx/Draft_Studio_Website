import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Nav from "@/components/layout/Nav";
import PageTransition from "@/components/layout/PageTransition";
import CustomCursor from "@/components/ui/CustomCursor";
import HtmlLang from "@/components/layout/HtmlLang";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd data={organizationSchema()} />
      <HtmlLang />
      <CustomCursor />
      <Nav />
      <PageTransition>{children}</PageTransition>
    </NextIntlClientProvider>
  );
}
