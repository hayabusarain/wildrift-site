"use client";

import { User, Globe, Menu } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

interface HeaderProps {
  onMenuToggle?: () => void;
  hideMenuButton?: boolean;
}

export function Header({ onMenuToggle, hideMenuButton }: HeaderProps) {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center space-x-2">
        {!hideMenuButton && (
          <button 
            onClick={onMenuToggle}
            className="p-2 -ml-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-slate-600" />
          </button>
        )}
        <div className="font-bold text-lg tracking-tight text-indigo-600 dark:text-indigo-400">

          {t("title")}
        </div>
      </div>
      <div className="flex items-center space-x-4">

        <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
          <User size={20} className="text-slate-600" />
        </button>
      </div>
    </header>
  );
}

