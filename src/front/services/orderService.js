const backendURL = import.meta.env.VITE_BACKEND_URL
// GET all orders
export async function getOrdersService() {
    const response = await fetch(`${backendURL}/orders`)
    const data = response.json();
    return data;
}

// GET single order
export async function getSingleOrderService(orderId) {
    const response = await fetch(`${backendURL}/orders/${orderId}`)
    if (response.status === 404) throw new Error("order not found")
    else if (response.status === 200) {
        const order = await response.json()
        return order;
    }
}

// Create new order
export async function createOrderService(orderData) {
    const newOrder = {
        table_id: orderData.table_id,
        waiter_id: orderData.waiter_id,
        people: orderData.people
    }
    const response = await fetch(`${backendURL}/orders`, {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 400) throw new Error("Some info is missing")
    else if (response.status === 200) return response;
}

// Delete order
export async function deleteOrderService(orderId) {
    const response = await fetch(`${backendURL}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("order not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data.message
    }

}

// Edit order
export async function editOrderService(orderId, orderData) {
    const editedOrder = {
        table_id: orderData.table_id,
        waiter_id: orderData.waiter_id,
        state: orderData.state,
        people: orderData.people
    }
    const response = await fetch(`${backendURL}/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify(editedOrder),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("order not found")
    else if (response.status === 200) return response;
}

/////////////////////////////////////////////////////////////////////////
// Get all orders
export async function getAllRestaurantOrdersService(restaurant_id) {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/orders`, {
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