const backendURL = import.meta.env.VITE_BACKEND_URL

// GET all clients (manager)
export async function getClientsService() {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/clients`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    })
    const data = response.json();
    return data;
}

// Create new client (manager)
export async function createClientService(clientData) {
    const managerToken = localStorage.getItem("managertoken")
    const newClient = {
        name: clientData.name,
        email: clientData.email,
        password: clientData.password,
        phone: clientData.phone
    }
    const response = await fetch(`${backendURL}/clients`, {
        method: "POST",
        body: JSON.stringify(newClient),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    })
    if (response.status === 400) throw new Error("Some info is missing")
    else if (response.status === 200) return response;
}

// Public client self-registration (no manager needed)
export async function clientRegisterService(clientData) {
    const newClient = {
        name: clientData.name,
        email: clientData.email,
        password: clientData.password,
        phone: clientData.phone
    }
    const response = await fetch(`${backendURL}/client_register`, {
        method: "POST",
        body: JSON.stringify(newClient),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 409) throw new Error("A client with this email already exists")
    else if (response.status === 400) throw new Error("Some info is missing")
    else if (response.status === 200) return response;
}

// Client login
export async function clientLoginService(clientLoginData) {
    const clientLogin = {
        email: clientLoginData.email,
        password: clientLoginData.password
    }
    const response = await fetch(`${backendURL}/client_login`, {
        method: "POST",
        body: JSON.stringify(clientLogin),
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

// Delete client (manager)
export async function deleteClientService(clientId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/clients/${clientId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    })
    if (response.status === 404) throw new Error("client not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data.message
    }
}

// Edit client (manager)
export async function editClientService(clientId, clientData) {
    const managerToken = localStorage.getItem("managertoken")
    const editedClient = {
        name: clientData.name,
        email: clientData.email,
        password: clientData.password,
        phone: clientData.phone
    }
    const response = await fetch(`${backendURL}/clients/${clientId}`, {
        method: "PUT",
        body: JSON.stringify(editedClient),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    })
    if (response.status === 404) throw new Error("client not found")
    else if (response.status === 200) return response;
}
