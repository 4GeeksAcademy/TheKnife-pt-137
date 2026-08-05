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
        recipe_id: productData.recipe_id,
        img_url: productData.img_url
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
        active: productData.active,
        img_url: productData.img_url
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

/////////////////////////////////////////////////////////////////////////
// Get all products
export async function getAllRestaurantProductsService(restaurant_id) {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/products`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred");
    else if (response.ok) {
        const data = await response.json()
        return data;
    }
}

// GET one product
export async function getOneRestaurantProductService(restaurant_id, product_id) {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/products/${product_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (response.status === 404) throw new Error("Product not found")
    else if (response.status === 200) {
        const product = await response.json()
        return product;
    }
}

// Chef can delete products of his restaurant
export async function deleteRestaurantProductService(restaurant_id, product_id) {
  const chefToken = localStorage.getItem("cheftoken")
  const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/products/${product_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${chefToken}`
    }
  })
  if (!response.ok) throw new Error("Some error has ocurred")
  else if (response.ok) {
    const data = await response.json()
    return data
  }
}

// Chef creates a product
export async function chefCreateProductService(restaurant_id, productData) {
    const chefToken = localStorage.getItem("cheftoken")
    const newProduct = {
        name: productData.name,
        description: productData.description,
        type: productData.type,
        sell_price: productData.sellPrice,
        recipe_id: productData.recipe_id,
        img_url: productData.img_url
    }
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/create_product`, {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    console.log(response)
    if (!response.ok) throw new Error("Some error has ocurred")
    else if (response.ok) {
        const data = await response.json()
        return data
    }
}

// Chef edits a product of his restaurant
export async function chefEditProductService(restaurant_id, product_id, productData) {
    const chefToken = localStorage.getItem("cheftoken")
    const editedProduct = {
        name: productData.name,
        description: productData.description,
        sell_price: productData.sellPrice,
        type: productData.type,
        active: productData.active,
        img_url: productData.img_url
    }
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/products/${product_id}`, {
        method: "PUT",
        body: JSON.stringify(editedProduct),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (response.status === 404) throw new Error("Product not found")
    else if (response.status === 200) return response;
}