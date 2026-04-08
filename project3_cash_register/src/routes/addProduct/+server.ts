import type { Product } from '$lib/server/inventory.remote.js';
import { addProduct } from '$lib/server/inventory.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const product = await request.json() as Product;
    
    console.log(JSON.stringify(product));

	addProduct(product);

	return json({}, { status: 201 });
}