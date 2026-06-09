import type { Metadata } from "next";
import { buildPageMeta, serviceSchema } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMeta("services", locale);
}

export default async function ServicesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <JsonLd data={serviceSchema(locale)} />
      {children}
    </>
  );
}
