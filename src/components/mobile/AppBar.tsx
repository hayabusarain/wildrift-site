"use client";

import { useTranslations } from "next-intl";

export function AppBar() {
  const t = useTranslations("Header");
  
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 h-14 flex items-center justify-center">
      <h1 className="font-bold text-base text-slate-800 tracking-tight">
        {t("title")}
      </h1>
    </header>
  );
}
