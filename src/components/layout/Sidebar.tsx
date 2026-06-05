import { Link } from "@/i18n/routing";
import { LayoutDashboard, Map, Calculator, Trophy, Users, Database, Sparkles, Package, Hexagon, History, X, BookOpen, ShoppingBag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  
  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 md:left-auto z-[70] w-64 bg-slate-900 text-slate-300 h-full flex flex-col border-r border-slate-800
        transition-transform duration-300 ease-in-out transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-wider">{t("title")}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <a href={`/${locale}/`} className="hidden" aria-hidden="true" />
          <Link 
            href="/" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>{t("home")}</span>
          </Link>
          <Link 
            href="/champions" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Users size={20} />
            <span>{t("champions")}</span>
          </Link>
          <Link 
            href="/items" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ShoppingBag size={20} />
            <span>{t("items")}</span>
          </Link>
          <Link 
            href="/spells" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Sparkles size={20} />
            <span>{t("summonerSpells")}</span>
          </Link>
          <Link 
            href="/runes" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Hexagon size={20} />
            <span>{t("runes")}</span>
          </Link>
          <Link 
            href="/tier-list" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Trophy size={20} />
            <span>{t("tierList")}</span>
          </Link>
          <Link 
            href="/patches" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <History size={20} />
            <span>{t("dashboard")}</span>
          </Link>
          <Link 
            href="/calculator" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Calculator size={20} />
            <span>{t("calculator")}</span>
          </Link>
          <Link 
            href="/guide" 
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <BookOpen size={20} />
            <span>{t("guide")}</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500/70 leading-relaxed space-y-3 mt-auto">
          <div className="flex flex-col space-y-2">
            <Link href="/terms" onClick={onClose} className="hover:text-slate-300 transition-colors">{t("terms")}</Link>
            <Link href="/privacy" onClick={onClose} className="hover:text-slate-300 transition-colors">{t("privacy")}</Link>
            <Link href="/legal" onClick={onClose} className="hover:text-slate-300 transition-colors">{t("legal")}</Link>
            <Link href="/contact" onClick={onClose} className="hover:text-slate-300 transition-colors">{t("contact")}</Link>
          </div>
        </div>
      </aside>
    </>
  );
}

