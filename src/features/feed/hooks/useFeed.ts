import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../services/feedService';
import { FeedItem, FeedTransaction } from '@/types/domain';

export function useFeed(feedItemId?: string, farmId: string = 'farm-001') {
  const queryClient = useQueryClient();

  const itemsQuery = useQuery({
    queryKey: ['feed-items', farmId],
    queryFn: () => feedService.getFeedItems(farmId),
  });

  const statsQuery = useQuery({
    queryKey: ['feed-stats', farmId],
    queryFn: () => feedService.getStats(farmId),
  });

  const transactionsQuery = useQuery({
    queryKey: ['feed-transactions', feedItemId],
    queryFn: () => (feedItemId ? feedService.getTransactions(feedItemId) : []),
    enabled: Boolean(feedItemId),
  });

  const createItemMutation = useMutation({
    mutationFn: (item: Omit<FeedItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      feedService.createFeedItem(item);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed-items'] });
      queryClient.invalidateQueries({ queryKey: ['feed-stats'] });
    },
  });

  const addTransactionMutation = useMutation({
    mutationFn: (transaction: Omit<FeedTransaction, 'id'>) => {
      feedService.addTransaction(transaction);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed-items'] });
      queryClient.invalidateQueries({ queryKey: ['feed-stats'] });
      queryClient.invalidateQueries({ queryKey: ['feed-transactions', feedItemId] });
    },
  });

  return {
    items: itemsQuery.data || [],
    stats: statsQuery.data,
    transactions: transactionsQuery.data || [],
    isLoading: itemsQuery.isLoading || statsQuery.isLoading,
    createItem: createItemMutation.mutate,
    addTransaction: addTransactionMutation.mutate,
  };
}
