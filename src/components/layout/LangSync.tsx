"use client";

import { useEffect } from "react";
import { useLang } from "@/context/LanguageContext";

export default function LangSync() {
  const { lang } = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
