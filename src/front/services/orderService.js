const backendURL = import.meta.env.VITE_BACKEND_URL
// GET all orders (manager)
export async function getOrdersService() {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/orders`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    })
    const data = response.json();
    return data;
}

// GET single order (manager)
export async function getSingleOrderService(orderId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/orders/${orderId}`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    })
    if (response.status === 404) throw new Error("order not found")
    else if (response.status === 200) {
        const order = await response.json()
        return order;
    }
}

// Create new order (manager)
export async function createOrderService(orderData) {
    const managerToken = localStorage.getItem("managertoken")
    const newOrder = {
        table_id: orderData.table_id,
        waiter_id: orderData.waiter_id,
        people: orderData.people
    }
    const response = await fetch(`${backendURL}/orders`, {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    })
    if (response.status === 400) throw new Error("Some info is missing")
    else if (response.status === 200) return response;
}

// Delete order (manager)
export async function deleteOrderService(orderId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    })
    if (response.status === 404) throw new Error("order not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data.message
    }

}

// Edit order (manager)
export async function editOrderService(orderId, orderData) {
    const managerToken = localStorage.getItem("managertoken")
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
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    })
    if (response.status === 404) throw new Error("order not found")
    else if (response.status === 200) return response;
}

/////////////////////////////////////////////////////////////////////////
// Get all orders
export async function getAllRestaurantOrdersService(restaurant_id) {
    const token = localStorage.getItem("cheftoken") || localStorage.getItem("waitertoken") || localStorage.getItem("cooktoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/orders`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred");
    else if (response.ok) {
        const data = await response.json()
        return data;
    }
}

// Get one order of the restaurant
export async function getSingleRestaurantOrderService(restaurant_id, order_id) {
    const token = localStorage.getItem("cheftoken") || localStorage.getItem("waitertoken") || localStorage.getItem("cooktoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/orders/${order_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (response.status === 404) throw new Error("order not found")
    else if (response.status === 200) {
        const order = await response.json()
        return order;
    }
    else throw new Error("Some error has ocurred")
}

// Cook updates the state of an order (doing/done)
export async function updateOrderStatusService(restaurant_id, order_id, state) {
    const cookToken = localStorage.getItem("cooktoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/orders/${order_id}/status`, {
        method: "PUT",
        body: JSON.stringify({ state }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookToken}`
        }
    })
    if (response.status === 404) throw new Error("order not found")
    else if (response.status === 200) {
        const order = await response.json()
        return order;
    }
    else throw new Error("Some error has ocurred")
}

// Waiter closes an order of his restaurant
export async function closeOrderService(restaurant_id, order_id) {
    const waiterToken = localStorage.getItem("waitertoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/orders/${order_id}/close`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${waiterToken}` }
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error closing order")
    }
    return await response.json()
}