'use client';

import { usePathname } from 'next/navigation';

export function CanonicalLinks({ locale }: { locale: string }) {
  const pathname = usePathname() || '';
  
  const baseUrl = 'https://hub-game.com';
  
  let cleanPathname = pathname;
  if (pathname.startsWith('/ja/')) cleanPathname = pathname.slice(3);
  else if (pathname === '/ja') cleanPathname = '/';
  else if (pathname.startsWith('/en/')) cleanPathname = pathname.slice(3);
  else if (pathname === '/en') cleanPathname = '/';

  if (cleanPathname === '/') cleanPathname = '';
  
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
