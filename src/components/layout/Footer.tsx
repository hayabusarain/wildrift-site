import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Sidebar");

  return (
    <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
      <p className="mb-2 max-w-4xl mx-auto leading-relaxed">
        {t("legalText")}
      </p>
      <p className="font-bold">
        {t("footer")}
      </p>
    </footer>
  );
}
