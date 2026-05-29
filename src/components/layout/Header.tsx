"use client";

import { User, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="font-semibold text-slate-800">
        {t("title")}
      </div>
      <div className="flex items-center space-x-4">

        <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
          <User size={20} className="text-slate-600" />
        </button>
      </div>
    </header>
  );
}
