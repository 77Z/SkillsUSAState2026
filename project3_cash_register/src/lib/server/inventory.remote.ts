import { query } from "$app/server";
import sqlite from 'better-sqlite3';

const db = new sqlite('main.db', {});
db.pragma('journal_mode = WAL');

export interface Product {
    SKU: string;
    Name: string;
    Description: string;
    Cost: number;
    SalePrice: number;
    Quantity: number;
};

export const getProducts = query(async (): Promise<Product[]> => {
    const posts = db.prepare("SELECT * FROM products").all() as Product[];

    return posts;
}); 

