import sqlite from 'better-sqlite3';
import type { Product } from "./inventory.remote";

const db = new sqlite('main.db', {});
db.pragma('journal_mode = WAL');

export function finalizeSale(productsSold: Product[]) {

    let subtotal = 0;
    for (const item of productsSold) subtotal += item.SalePrice;

    let taxes = subtotal * 0.055;

    const currentDate = new Date();

    db.prepare("INSERT INTO sales (Date, Subtotal, Taxes) VALUES (?, ?, ?)").run(
        currentDate.toLocaleDateString('en-US'),
        subtotal,
        taxes
    );

    // Subtract from current supply

    for (const item of productsSold) {
        // get current quantity of product item
        const res = db.prepare("SELECT * FROM products WHERE SKU = ?").all(item.SKU) as Product[];

        // console.log(res);

        console.log(`new quantity ${res[0].Quantity - 1}`);

        db.prepare("UPDATE products SET Quantity = ? WHERE SKU = ?").run(
            res[0].Quantity - 1,
            item.SKU
        );
    }
}