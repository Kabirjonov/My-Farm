import { dbInstance } from '../database';
import { FeedItem, FeedTransaction } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';

export interface FeedStats {
  totalTypes: number;
  lowStockCount: number;
  totalOutToday: number;
}

export const feedRepository = {
  listItems(farmId: string = 'farm-001'): FeedItem[] {
    return dbInstance.getAllSync<FeedItem>(
      'SELECT * FROM feed_inventory WHERE farmId = ? ORDER BY name ASC',
      [farmId]
    );
  },

  findItemById(id: string): FeedItem | null {
    return dbInstance.getFirstSync<FeedItem>('SELECT * FROM feed_inventory WHERE id = ?', [id]);
  },

  createItem(input: Omit<FeedItem, 'id' | 'createdAt' | 'updatedAt'>): FeedItem {
    const id = generateUUID();
    const now = new Date().toISOString();
    const item: FeedItem = {
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
    };

    dbInstance.runSync(
      `INSERT INTO feed_inventory (id, farmId, name, category, unit, currentQuantity, minQuantity, averagePrice, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.farmId,
        item.name,
        item.category ?? null,
        item.unit,
        item.currentQuantity,
        item.minQuantity,
        item.averagePrice ?? 0,
        item.notes ?? null,
        item.createdAt,
        item.updatedAt,
      ]
    );

    return item;
  },

  updateItem(id: string, updates: Partial<Omit<FeedItem, 'id' | 'createdAt'>>): FeedItem | null {
    const existing = this.findItemById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: FeedItem = {
      ...existing,
      ...updates,
      updatedAt: now,
    };

    dbInstance.runSync(
      `UPDATE feed_inventory
       SET name = ?, category = ?, unit = ?, currentQuantity = ?, minQuantity = ?, averagePrice = ?, notes = ?, updatedAt = ?
       WHERE id = ?`,
      [
        updated.name,
        updated.category ?? null,
        updated.unit,
        updated.currentQuantity,
        updated.minQuantity,
        updated.averagePrice ?? 0,
        updated.notes ?? null,
        updated.updatedAt,
        id,
      ]
    );

    return updated;
  },

  listTransactions(feedItemId: string): FeedTransaction[] {
    return dbInstance.getAllSync<FeedTransaction>(
      'SELECT * FROM feed_transactions WHERE feedItemId = ? ORDER BY date DESC',
      [feedItemId]
    );
  },

  addTransaction(input: Omit<FeedTransaction, 'id'>): FeedTransaction {
    const id = generateUUID();
    const transaction: FeedTransaction = { ...input, id };

    dbInstance.runSync(
      `INSERT INTO feed_transactions (id, feedItemId, type, quantity, unit, price, date, relatedAnimalId, relatedGroupId, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction.id,
        transaction.feedItemId,
        transaction.type,
        transaction.quantity,
        transaction.unit,
        transaction.price ?? 0,
        transaction.date,
        transaction.relatedAnimalId ?? null,
        transaction.relatedGroupId ?? null,
        transaction.notes ?? null,
      ]
    );

    // Update currentQuantity in feed_inventory
    const feedItem = this.findItemById(transaction.feedItemId);
    if (feedItem) {
      let newQty = feedItem.currentQuantity;
      if (transaction.type === 'IN') {
        newQty += transaction.quantity;
      } else if (transaction.type === 'OUT' || transaction.type === 'WASTE') {
        newQty = Math.max(0, newQty - transaction.quantity);
      } else if (transaction.type === 'ADJUSTMENT') {
        newQty = transaction.quantity;
      }
      this.updateItem(feedItem.id, { currentQuantity: newQty });
    }

    // Auto-create expense if type === 'IN' and price > 0
    if (transaction.type === 'IN' && transaction.price && transaction.price > 0) {
      dbInstance.runSync(
        `INSERT INTO expenses (id, farmId, category, amount, description, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateUUID(),
          'farm-001',
          'FEED',
          transaction.price * transaction.quantity,
          `Yem xaridi: ${feedItem?.name || 'Ozuqa'} (${transaction.quantity} ${transaction.unit})`,
          transaction.date,
        ]
      );
    }

    return transaction;
  },

  getStats(farmId: string = 'farm-001'): FeedStats {
    const items = this.listItems(farmId);
    const lowStockCount = items.filter((item) => item.currentQuantity <= item.minQuantity).length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayTransactions = dbInstance.getAllSync<FeedTransaction>(
      "SELECT * FROM feed_transactions WHERE (type = 'OUT' OR type = 'WASTE') AND date = ?",
      [todayStr]
    );
    const totalOutToday = todayTransactions.reduce((acc, t) => acc + t.quantity, 0);

    return {
      totalTypes: items.length,
      lowStockCount,
      totalOutToday,
    };
  },
};
