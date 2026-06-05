import { Link } from "@/i18n/routing";
import { Home, Users, ShoppingBag, Trophy, Menu } from "lucide-react";
import { useTranslations } from "next-intl";

interface BottomNavProps {
  onMenuToggle: () => void;
}

export function BottomNav({ onMenuToggle }: BottomNavProps) {
  const t = useTranslations("Sidebar"); // Reusing sidebar translations for navigation

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 pb-safe">
        <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
          <Home size={22} className="mb-1" />
          <span className="text-[10px] font-bold">{t("home")}</span>
        </Link>
        <Link href="/champions" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
          <Users size={22} className="mb-1" />
          <span className="text-[10px] font-bold">{t("champions")}</span>
        </Link>
        <Link href="/items" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
          <ShoppingBag size={22} className="mb-1" />
          <span className="text-[10px] font-bold">{t("items")}</span>
        </Link>
        <Link href="/tier-list" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
          <Trophy size={22} className="mb-1" />
          <span className="text-[10px] font-bold">{t("tierList")}</span>
        </Link>
        <button 
          onClick={onMenuToggle}
          className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 active:bg-slate-100 dark:active:bg-slate-800"
        >
          <Menu size={22} className="mb-1" />
          <span className="text-[10px] font-bold">メニュー</span>
        </button>
      </div>
    </div>
  );
}
