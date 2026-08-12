import * as SQLite from 'expo-sqlite';

export const dbInstance = SQLite.openDatabaseSync('myfarm.db');
