const backendURL = import.meta.env.VITE_BACKEND_URL
// GET all waiters
export async function getWaitersService() {
    const response = await fetch(`${backendURL}/waiters`)
    const data = response.json();
    return data;
}

// GET single waiter
export async function getSingleWaiterService(waiterId) {
    const response = await fetch(`${backendURL}/waiters/${waiterId}`)
    if (response.status === 404) throw new Error("Waiter not found")
    else if (response.status === 200) {
        const waiter = await response.json()
        return waiter;
    }
}

// Create new waiter
export async function createWaiterService(waiterData) {
    const newWaiter = {
        name: waiterData.name,
        email: waiterData.email,
        password: waiterData.password,
        restaurant_id: waiterData.restaurant_id
    }
    const response = await fetch(`${backendURL}/waiters`, {
        method: "POST",
        body: JSON.stringify(newWaiter),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 400) throw new Error("Some info is missing")
    else if (response.status === 200) return response;
}

// Waiter login
export async function waiterLoginService(waiterLoginData) {
    const loginData = {
        email: waiterLoginData.email,
        password: waiterLoginData.password
    }
    const response = await fetch(`${backendURL}/waiter_login`, {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 400) throw new Error("Email or password incorrect")
    else if (response.status === 404) throw new Error("Waiter doesn't have a restaurant asigned")
    else if (response.status === 200) {
        const data = await response.json()
        return data;
    }
}

// Delete waiter
export async function deleteWaiterService(waiterId) {
    const response = await fetch(`${backendURL}/waiters/${waiterId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("Waiter not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data.message
    }

}

// Edit waiter
export async function editWaiterService(waiterId, waiterData) {
    const editedWaiter = {
        name: waiterData.name,
        email: waiterData.email,
        password: waiterData.password
    }
    const response = await fetch(`${backendURL}/waiters/${waiterId}`, {
        method: "PUT",
        body: JSON.stringify(editedWaiter),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("Waiter not found")
    else if (response.status === 200) return response;
}