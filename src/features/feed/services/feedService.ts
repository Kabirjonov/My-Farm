import { feedRepository, FeedStats } from '@/lib/db';
import { FeedItem, FeedTransaction } from '@/types/domain';

export const feedService = {
  getFeedItems(farmId?: string): FeedItem[] {
    return feedRepository.listItems(farmId);
  },

  getFeedItemById(id: string): FeedItem | null {
    return feedRepository.findItemById(id);
  },

  getStats(farmId?: string): FeedStats {
    return feedRepository.getStats(farmId);
  },

  createFeedItem(item: Omit<FeedItem, 'id' | 'createdAt' | 'updatedAt'>): FeedItem {
    return feedRepository.createItem(item);
  },

  updateFeedItem(id: string, updates: Partial<Omit<FeedItem, 'id' | 'createdAt'>>): FeedItem | null {
    return feedRepository.updateItem(id, updates);
  },

  getTransactions(feedItemId: string): FeedTransaction[] {
    return feedRepository.listTransactions(feedItemId);
  },

  addTransaction(transaction: Omit<FeedTransaction, 'id'>): FeedTransaction {
    return feedRepository.addTransaction(transaction);
  },
};
