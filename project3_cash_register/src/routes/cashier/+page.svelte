<script lang="ts">
	import type { Product } from '$lib/server/inventory.remote';

	interface Adapter {
		data: { items: Product[] };
	}
	let item: Adapter = $props();

	let cart: Product[] = $state([]);

	let subtotal = $state(0);
	let taxes = $state(0);
	let total = $state(0);

	function addMeToCart(product: Product) {
		cart.push(product);

		calculateCosts();
	}

	function calculateCosts() {
		subtotal = 0;
		for (const product of cart) {
			subtotal += product.SalePrice;
		}

		taxes = subtotal * 0.055; // 5.5%

		total = subtotal + taxes;
	}

	async function finalizeSale() {
		const response = await fetch('/finalizeSale', {
			method: 'POST',
			body: JSON.stringify(cart),
			headers: {
				'Content-Type': 'application/json'
			}
		});

        if (response.ok) {
            clearCart();
        }
	}

    function clearCart() {
        cart = [];
        calculateCosts();
    }
</script>

<div class="available-products">
	{#each item.data.items as product}
		<div>
			{product.Name} · {product.Cost}
			<button
				onclick={() => {
					addMeToCart(product);
				}}>Add</button
			>
		</div>
	{/each}
</div>

<div class="cart-view">
	<h1>Cart</h1>

	<div class="cart-items">
		{#key cart}
			{#each cart as cartItem}
				<div>{cartItem.SalePrice} · {cartItem.SKU} · {cartItem.Name}</div>
			{/each}
		{/key}
	</div>

	<div class="cart-info">Subtotal: ${subtotal}</div>
	<div class="cart-info">Sales Tax: ${taxes}</div>
	<div class="cart-info"><b>Total: ${total}</b></div>
	<div class="cart-actions">
		<button onclick={() => clearCart()}>Clear Cart</button>
		<button onclick={() => finalizeSale()}>Finalize Sale</button>
	</div>
</div>

<a class="switchView" href="/admin"> Switch to Admin </a>

<style>
	.switchView {
		position: fixed;
		bottom: 10px;
		left: 10px;
		background: #f00;
		color: #fff;
		cursor: pointer;
		border-radius: 6px;
		padding: 20px 40px;
		border: none;
		font-weight: bold;
		text-decoration: none;
	}

	.cart-view {
		display: flex;
		position: fixed;
		top: 0;
		right: 0;
		height: 100%;
		width: 50%;
		flex-direction: column;
		box-sizing: border-box;
		padding: 15px;
	}

	.cart-items {
		background: #111;
		flex-grow: 1;
	}

	.cart-info {
		text-align: end;
	}

	.cart-actions {
		display: flex;
		gap: 5px;
	}

	.cart-actions button {
		flex-grow: 1;
		flex-shrink: 0;
		padding: 10px;
		cursor: pointer;
		background: #222;
		color: #fff;
		border: none;
		border-radius: 5px;
	}

	.available-products {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		padding: 15px;
		box-sizing: border-box;
		width: 50%;
		height: 50%;
		overflow-y: scroll;
	}
</style>
