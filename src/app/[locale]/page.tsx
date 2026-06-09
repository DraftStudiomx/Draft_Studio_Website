import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Philosophy from "@/components/home/Philosophy";
import WorkPreview from "@/components/home/WorkPreview";
import Process from "@/components/home/Process";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";
import { buildPageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMeta("home", locale);
}

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <Philosophy />
        <WorkPreview />
        <Process />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
