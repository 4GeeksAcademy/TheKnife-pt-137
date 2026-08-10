const backendURL = import.meta.env.VITE_BACKEND_URL;

// GET all hosts (manager)
export async function getHostsService() {
    const managerToken = localStorage.getItem("managertoken");
    const response = await fetch(`${backendURL}/hosts`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    });
    if (!response.ok) throw new Error("Error fetching hosts");
    return await response.json();
}

// GET single host (manager)
export async function getSingleHostService(hostId) {
    const managerToken = localStorage.getItem("managertoken");
    const response = await fetch(`${backendURL}/hosts/${hostId}`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    });
    if (response.status === 404) throw new Error("Host not found");
    else if (response.status === 200) return await response.json();
}

// Host login
export async function hostLoginService(hostLoginData) {
    const loginData = {
        email: hostLoginData.email,
        password: hostLoginData.password
    };
    const response = await fetch(`${backendURL}/host_login`, {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status === 400) throw new Error("Email or password incorrect");
    else if (response.status === 404) throw new Error("Host doesn't have a restaurant asigned");
    else if (response.status === 200) return await response.json();
}

// Delete host (manager)
export async function deleteHostService(hostId) {
    const managerToken = localStorage.getItem("managertoken");
    const response = await fetch(`${backendURL}/hosts/${hostId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    });
    if (response.status === 404) throw new Error("Host not found");
    else if (response.status === 200) {
        const data = await response.json();
        return data.message;
    }
}

// Edit host (manager)
export async function editHostService(hostId, hostData) {
    const managerToken = localStorage.getItem("managertoken");
    const editedHost = {
        name: hostData.name,
        email: hostData.email,
        password: hostData.password
    };
    const response = await fetch(`${backendURL}/hosts/${hostId}`, {
        method: "PUT",
        body: JSON.stringify(editedHost),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    });
    if (response.status === 404) throw new Error("Host not found");
    else if (response.status === 200) return response;
}

/////////////////////////////////////////////////////////////////////////////
// Chef registers a host in his restaurant
export async function hostRegisterService(restaurant_id, hostData) {
    const chefToken = localStorage.getItem("cheftoken");
    const newHost = {
        name: hostData.name,
        email: hostData.email,
        password: hostData.password
    };
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/host_register`, {
        method: "POST",
        body: JSON.stringify(newHost),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    });
    let data = {};
    try {
        data = await response.json();
    } catch {
        // Respuesta no-JSON (normalmente una ruta inexistente por falta de restaurante)
    }
    if (!response.ok) throw new Error(data.message || "No se pudo registrar el host. ¿Tu chef tiene un restaurante asignado?");
    return data;
}

// Chef can see the host of his restaurant
export async function getRestaurantHostService(restaurant_id) {
    const chefToken = localStorage.getItem("cheftoken");
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/host`, {
        headers: {
            "Authorization": `Bearer ${chefToken}`
        }
    });
    if (response.status === 404) return null; // no host yet
    if (!response.ok) throw new Error("Some error has ocurred");
    return await response.json();
}
