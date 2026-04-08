import sqlite from 'better-sqlite3';
import type { Product } from "./inventory.remote";

const db = new sqlite('main.db', {});
db.pragma('journal_mode = WAL');

export function addProduct(product: Product) {
    db.prepare("INSERT INTO products (SKU, Name, Description, Cost, SalePrice, Quantity) VALUES (?, ?, ?, ?, ?, ?)").run(
        product.SKU,
        product.Name,
        product.Description,
        product.Cost,
        product.SalePrice,
        product.Quantity
    );
}