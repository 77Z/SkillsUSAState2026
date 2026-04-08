import { getProducts, type Product } from '$lib/server/inventory.remote.js';

export async function load({ locals }) {
  const items: Product[] = await getProducts();
  return { items };
}