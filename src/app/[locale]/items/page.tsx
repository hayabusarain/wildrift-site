import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ItemsClient from './ItemsClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === 'ja' ? '全アイテム一覧・ソート検索' : 'Items Database & Sort';
  const description = locale === 'ja' 
    ? 'ワイルドリフト(Wild Rift)の全アイテム一覧データベース。ゴールド、攻撃力、魔力などステータス別にソート・検索が可能。' 
    : 'Wild Rift all items database. Sort and search by gold, AD, AP, and other stats.';
  
  return {
    title,
    description,
  };
}

export default async function ItemsPage() {
  return <ItemsClient />;
}
