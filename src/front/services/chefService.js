const backendURL = import.meta.env.VITE_BACKEND_URL
// GET all chefs
export async function getChefsService() {
    const response = await fetch(`${backendURL}/chefs`)
    const data = response.json();
    return data;
}

// GET single chef
export async function getSingleChefService(chefId) {
    const response = await fetch(`${backendURL}/chefs/${chefId}`)
    if (response.status === 404) throw new Error("chef not found")
    else if (response.status === 200) {
        const chef = await response.json()
        return chef;
    }
}

// Create new chef
export async function createChefService(chefData) {
    const newChef = {
        name: chefData.name,
        email: chefData.email,
        password: chefData.password,
        restaurant_id: chefData.restaurant_id
    }
    const response = await fetch(`${backendURL}/chefs`, {
        method: "POST",
        body: JSON.stringify(newChef),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 400) throw new Error("Some info is missing")
    else if (response.status === 200) return response;
}

// Chef login
export async function chefLoginService(chefLoginData) {
    const chefLogin = {
        email: chefLoginData.email,
        password: chefLoginData.password
    }
    const response = await fetch(`${backendURL}/chef_login`, {
        method: "POST",
        body: JSON.stringify(chefLogin),
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (!response.ok) throw new Error("Email or password incorrect")
    else if (response.ok) {
        const data = await response.json()
        return data
    }
}

// Delete chef
export async function deleteChefService(chefId) {
    const response = await fetch(`${backendURL}/chefs/${chefId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("chef not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data.message
    }

}

// Edit chef
export async function editChefService(chefId, chefData) {
    const editedChef = {
        name: chefData.name,
        email: chefData.email,
        password: chefData.password,
        restaurant_id: chefData.restaurant_id
    }
    const response = await fetch(`${backendURL}/chefs/${chefId}`, {
        method: "PUT",
        body: JSON.stringify(editedChef),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("chef not found")
    else if (response.status === 200) return response;
}