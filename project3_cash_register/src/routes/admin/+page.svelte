<script lang="ts">
    import type { Product } from "$lib/server/inventory.remote";

    interface Adapter { data: { items: Product[] } }
    let item: Adapter = $props();

    let newProduct: Product = {
        SKU: "",
        Name: "",
        Description: "",
        Cost: 0,
        SalePrice: 0,
        Quantity: 0,
    };

    async function addProduct() {
        const response = await fetch('/addProduct', {
			method: 'POST',
			body: JSON.stringify(newProduct),
			headers: {
				'Content-Type': 'application/json'
			}
		});
    }

</script>

<!-- Svelte doesn't like HTML tables -->
<div class="table">
    <div class="row">
        <span><b>SKU</b></span>
        <span><b>Name</b></span>
        <span><b>Description</b></span>
        <span><b>Cost</b></span>
        <span><b>Sale Price</b></span>
        <span><b>Quantity</b></span>
        <span><b>Projected Profit</b></span>
    </div>

    {#each item.data.items as product}
    
        <div class="row">
            <span>{product.SKU}</span>
            <span>{product.Name}</span>
            <span>{product.Description}</span>
            <span>{product.Cost}</span>
            <span>{product.SalePrice}</span>
            <span>{product.Quantity}</span>
            <span>{product.SalePrice - product.Cost}</span>
        </div>
    
    {/each}

</div>


<div class="form-container">
    <h2>Add New Product</h2>
    <input type="text" placeholder="SKU" bind:value={newProduct.SKU} required />
    <input type="text" placeholder="Name" bind:value={newProduct.Name} required />
    <input type="text" placeholder="Description" bind:value={newProduct.Description} required />
    <input type="number" placeholder="Cost" bind:value={newProduct.Cost} required />
    <input type="number" placeholder="Sale Price" bind:value={newProduct.SalePrice} required />
    <input type="number" placeholder="Quantity" bind:value={newProduct.Quantity} required />
    <button onclick={() => addProduct()}>Add Product</button>
</div>


<h1>Reports</h1>
<h4>Today's Summary</h4>





<a class="switchView" href="/cashier">
    Switch to Cashier
</a>

<style>
    .table {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .row {
        display: flex;
        
    }

    .row span {
        width: 100px;
        border: 1px solid #ffffff50;
        box-sizing: border-box;
        padding: 5px;
    }

    .switchView {
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: #00f;
        color: #fff;
        cursor: pointer;
        border-radius: 6px;
        padding: 20px 40px;
        border: none;
        font-weight: bold;
        text-decoration: none;
    }

    .form-container {
        margin: 20px 0;
        padding: 20px;
        border: 1px solid #ffffff50;
        border-radius: 6px;
    }

    form {
        display: flex;
        gap: 10px;
    }

    input, button {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        background: #00f;
        color: #fff;
        cursor: pointer;
        font-weight: bold;
    }
</style>