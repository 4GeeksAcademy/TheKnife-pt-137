const backendURL = import.meta.env.VITE_BACKEND_URL
// GET all products
export async function getProductsService() {
    const response = await fetch(`${backendURL}/products`)
    const data = response.json();
    return data;
}

// GET single product
export async function getSingleProductService(productId) {
    const response = await fetch(`${backendURL}/products/${productId}`)
    if (response.status === 404) throw new Error("Product not found")
    else if (response.status === 200) {
        const product = await response.json()
        return product;
    }
}

// Create new product
export async function createProductService(productData) {
    const newProduct = {
        name: productData.name,
        description: productData.description,
        sell_price: productData.sellPrice,
        type: productData.type,
        restaurant_id: productData.restaurant_id,
        recipe_id: productData.recipe_id
    }
    const response = await fetch(`${backendURL}/products`, {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 400) throw new Error("Some info is missing")
    else if (response.status === 200) return response;
}

// Delete product
export async function deleteProductService(productId) {
    const response = await fetch(`${backendURL}/products/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("Product not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data.message
    }

}

// Edit product
export async function editProductService(productId, productData) {
    const editedProduct = {
        name: productData.name,
        description: productData.description,
        sell_price: productData.sellPrice,
        type: productData.type,
        active: productData.active
    }
    const response = await fetch(`${backendURL}/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(editedProduct),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("Product not found")
    else if (response.status === 200) return response;
}