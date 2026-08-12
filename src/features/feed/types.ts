export type FeedUnit = 'KG' | 'BALE' | 'TON' | 'BAG';

export interface FeedItem {
  id: string;
  name: string; // 'Beda', 'Somon', 'Arpa', 'Kepak', 'Silos'
  quantity: number;
  unit: FeedUnit;
  updatedAt: string;
}
