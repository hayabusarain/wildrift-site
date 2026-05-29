import { Link } from "@/i18n/routing";
import { LayoutDashboard, Map, Calculator, Trophy, Users, Database, Sparkles, Package, Hexagon, History } from "lucide-react";
import { useTranslations } from "next-intl";

export function Sidebar() {
  const t = useTranslations("Sidebar");
  
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white tracking-wider">{t("title")}</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link 
          href="/" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LayoutDashboard size={20} />
          <span>{t("home")}</span>
        </Link>
        <Link 
          href="/tier-list" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Trophy size={20} />
          <span>{t("tierList")}</span>
        </Link>
        <Link 
          href="/patches" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <History size={20} />
          <span>{t("dashboard")}</span>
        </Link>
        <Link 
          href="/champions" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Users size={20} />
          <span>{t("champions")}</span>
        </Link>

        <Link 
          href="/calculator" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Calculator size={20} />
          <span>{t("calculator")}</span>
        </Link>

      </nav>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500/70 leading-relaxed space-y-3">
        <div className="flex flex-col space-y-2 mb-4">
          <Link href="/terms" className="hover:text-slate-300 transition-colors">{t("terms")}</Link>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">{t("privacy")}</Link>
          <Link href="/legal" className="hover:text-slate-300 transition-colors">{t("legal")}</Link>
          <Link href="/contact" className="hover:text-slate-300 transition-colors">{t("contact")}</Link>
        </div>
        <p className="text-[10px]">{t("legalText")}</p>
        <p className="font-bold text-slate-500 text-[10px]">{t("footer")}</p>
      </div>
    </aside>
  );
}
