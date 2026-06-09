import type { Metadata } from "next";

const titles: Record<string, string> = {
  "estudios-nacionales": "Estudios Nacionales",
  "contavlic": "Contavlic",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: titles[slug] ?? "Case Study" };
}

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
