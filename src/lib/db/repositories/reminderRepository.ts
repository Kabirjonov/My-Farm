import { dbInstance } from '../database';
import { Reminder } from '@/types/domain';
import { generateUUID } from '@/utils/uuid';

export const reminderRepository = {
  list(isCompleted?: boolean): Reminder[] {
    if (typeof isCompleted === 'boolean') {
      return dbInstance.getAllSync<Reminder>(
        'SELECT * FROM reminders WHERE isCompleted = ? ORDER BY dueDate ASC',
        [isCompleted ? 1 : 0]
      );
    }
    return dbInstance.getAllSync<Reminder>('SELECT * FROM reminders ORDER BY dueDate ASC');
  },

  create(input: Omit<Reminder, 'id'>): Reminder {
    const id = generateUUID();
    const reminder: Reminder = { ...input, id };

    dbInstance.runSync(
      `INSERT INTO reminders (id, title, description, dueDate, isCompleted, relatedEntityName, relatedEntityId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        reminder.id,
        reminder.title,
        reminder.description ?? null,
        reminder.dueDate,
        reminder.isCompleted ? 1 : 0,
        reminder.relatedEntityName ?? null,
        reminder.relatedEntityId ?? null,
      ]
    );

    return reminder;
  },

  toggleCompleted(id: string): void {
    const existing = dbInstance.getFirstSync<Reminder>('SELECT * FROM reminders WHERE id = ?', [id]);
    if (!existing) return;
    const newStatus = existing.isCompleted ? 0 : 1;
    dbInstance.runSync('UPDATE reminders SET isCompleted = ? WHERE id = ?', [newStatus, id]);
  },
};
