import type { Product } from '$lib/server/inventory.remote.js';
import { finalizeSale } from '$lib/server/sales.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const sale = await request.json() as Product[];

    finalizeSale(sale);

	return json({}, { status: 201 });
}