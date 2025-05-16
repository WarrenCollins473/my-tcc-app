import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase) {
  console.log("Initializing database...");
  await db.execAsync(` 
    CREATE TABLE IF NOT EXISTS documento (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    categoria TEXT, 
    atividade TEXT, 
    tipo TEXT, 
    observacao TEXT, 
    link TEXT, 
    horas INTEGER
);
`);
}
