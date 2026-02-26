// db.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('tasks.db');

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT
    );
  `);
};
export const addTask = (title: string, desc: string, date: string) => {
  return db.runSync('INSERT INTO tasks (title, description, date) VALUES (?, ?, ?)', [title, desc, date]);
};

export const getTasks = () => {
  return db.getAllSync('SELECT * FROM tasks');
};
export const deleteTask = (id: number) => db.runSync('DELETE FROM tasks WHERE id = ?', [id]);

export const getTaskById = (id: number) => 
  db.getFirstSync('SELECT * FROM tasks WHERE id = ?', [id]);

export const updateTask = (id: number, title: string, desc: string, date: string) => 
  db.runSync('UPDATE tasks SET title = ?, description = ?, date = ? WHERE id = ?', [title, desc, date, id]);