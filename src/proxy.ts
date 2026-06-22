import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // If the user already has a saved preference (cookie), let next-intl handle it
  const hasLocaleCookie = request.cookies.has('NEXT_LOCALE');
  
  if (!hasLocaleCookie) {
    // Vercel populates 'x-vercel-ip-country' header with geographical information
    const country = request.headers.get('x-vercel-ip-country');
    
    if (country === 'JP') {
      // Force Japan to ja
      request.headers.set('accept-language', 'ja,en;q=0.9');
    } else if (country) {
      // Any other country to en
      request.headers.set('accept-language', 'en,ja;q=0.9');
    } else {
      // Localhost fallback: check native accept-language header,
      // but override it to be English if it's not strictly Japanese.
      // Next-intl's default logic will handle this if we leave it alone,
      // but we can also leave the header untouched.
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ja|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
