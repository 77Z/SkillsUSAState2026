import { query } from "$app/server";
import sqlite from 'better-sqlite3';

const db = new sqlite('main.db', {});
db.pragma('journal_mode = WAL');

export function verifyDB() {
    db.exec(`
        DROP TABLE IF EXISTS products;
        CREATE TABLE products (
            name TEXT NOT NULL,

        );`);
    const productInsert = db.prepare('INSERT INTO products (name) VALUES (?)')
}