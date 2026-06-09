import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMeta("studio", locale);
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
