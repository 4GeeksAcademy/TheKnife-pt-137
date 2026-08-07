const backendURL = import.meta.env.VITE_BACKEND_URL
// GET all managers
export async function getManagersService() {
    const response = await fetch(`${backendURL}/managers`)
    const data = response.json();
    return data;
}

// Create new manager
export async function createManagerService(managerData) {
    const newManager = {
        name: managerData.name,
        email: managerData.email,
        password: managerData.password
    }
    const response = await fetch(`${backendURL}/managers`, {
        method: "POST",
        body: JSON.stringify(newManager),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 400) throw new Error("Some info is missing")
    else if (response.status === 200) return response;
}

// Manager login
export async function managerLoginService(managerLoginData) {
    const managerLogin = {
        email: managerLoginData.email,
        password: managerLoginData.password
    }
    const response = await fetch(`${backendURL}/manager_login`, {
        method: "POST",
        body: JSON.stringify(managerLogin),
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

// Delete manager
export async function deleteManagerService(managerId) {
    const response = await fetch(`${backendURL}/managers/${managerId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("manager not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data.message
    }

}

// Edit manager
export async function editManagerService(managerId, managerData) {
    const editedManager = {
        name: managerData.name,
        email: managerData.email,
        password: managerData.password
    }
    const response = await fetch(`${backendURL}/managers/${managerId}`, {
        method: "PUT",
        body: JSON.stringify(editedManager),
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.status === 404) throw new Error("manager not found")
    else if (response.status === 200) return response;
}