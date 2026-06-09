"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Sets the <html lang="..."> attribute dynamically based on the active locale. */
export default function HtmlLang() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
