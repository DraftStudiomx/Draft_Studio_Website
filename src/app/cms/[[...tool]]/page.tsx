"use client";
/**
 * Sanity Studio — accesible en /cms
 * Este archivo monta el Studio embebido dentro de Next.js App Router.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/sanity.config";


export default function CMSPage() {
  return <NextStudio config={config} />;
}
