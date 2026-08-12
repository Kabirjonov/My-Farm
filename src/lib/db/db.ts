import { runMigrations } from './migrations';
import { seedDatabaseIfEmpty } from './seed';
export { dbInstance as db } from './database';

export function initDatabase(): void {
  runMigrations();
  seedDatabaseIfEmpty();
}
