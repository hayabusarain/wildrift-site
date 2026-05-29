import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      template: '%s | Wild Rift Hub',
      default: t('defaultTitle'),
    },
    description: t('description'),
    keywords: ["Wild Rift", "Tier List", "パッチノート", "LoL", "相性", "ワイルドリフト", "ワイリフ"],
    openGraph: {
      title: 'Wild Rift Hub',
      description: t('description'),
      url: 'https://your-domain.com',
      siteName: 'Wild Rift Hub',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Wild Rift Hub',
        },
      ],
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Wild Rift Hub',
      description: t('description'),
      images: ['/images/og-image.jpg'],
    },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
