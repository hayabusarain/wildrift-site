'use client';

import { usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export function CanonicalLinks() {
  const pathname = usePathname();
  const locale = useLocale();
  
  const baseUrl = 'https://hub-game.com';
  
  // pathname is the unlocalized path, e.g. "/champions/Amumu" or "/"
  const cleanPathname = pathname === '/' ? '' : pathname;
  
  const currentUrl = `${baseUrl}/${locale}${cleanPathname}`;
  const jaUrl = `${baseUrl}/ja${cleanPathname}`;
  const enUrl = `${baseUrl}/en${cleanPathname}`;
  // For x-default, we can point to the Japanese version since it's our default
  const xDefaultUrl = jaUrl;

  return (
    <>
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hrefLang="ja" href={jaUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={xDefaultUrl} />
    </>
  );
}
