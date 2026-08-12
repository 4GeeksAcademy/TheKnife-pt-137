const backendURL = import.meta.env.VITE_BACKEND_URL;

// GET all tables (manager)
export async function getTablesService() {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/tables`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    });
    if (!response.ok) throw new Error("Error fetching tables");
    return await response.json();
}

// GET single table (manager)
export async function getSingleTableService(tableId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/tables/${tableId}`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    });
    if (!response.ok) throw new Error("Table not found");
    return await response.json();
}

// Create new table (manager)
export async function createTableService(tableData) {
    const managerToken = localStorage.getItem("managertoken")
    const newTable = {
        number: tableData.number,
        status: tableData.status,
        location: tableData.location,
        restaurant_id: tableData.restaurant_id
    };

    const response = await fetch(`${backendURL}/tables`, {
        method: "POST",
        body: JSON.stringify(newTable),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    });

    if (!response.ok) throw new Error("Error creating table");
    return await response.json();
}

// Delete table (manager)
export async function deleteTableService(tableId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/tables/${tableId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    });

    if (!response.ok) throw new Error("Table not found");
    const data = await response.json();
    return data.message;
}

// Edit table (manager)
export async function editTableService(tableId, tableData) {
    const managerToken = localStorage.getItem("managertoken")
    const editedTable = {
        number: tableData.number,
        status: tableData.status, // Corregido: antes tenías 'state'
        location: tableData.location
    };

    const response = await fetch(`${backendURL}/tables/${tableId}`, {
        method: "PUT",
        body: JSON.stringify(editedTable),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error editing table");
    }

    return await response.json(); // Corregido: ahora devuelve el objeto JSON
}

/////////////////////////////////////////////////////////////////////////
// Get all tables of the restaurant
export async function getAllRestaurantTablesService(restaurant_id) {
    const token = localStorage.getItem("waitertoken") || localStorage.getItem("cheftoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/tables`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    return await response.json()
}

// Get inactive (deactivated) tables of the restaurant
export async function getInactiveRestaurantTablesService(restaurant_id) {
    const token = localStorage.getItem("waitertoken") || localStorage.getItem("cheftoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/tables/inactive`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    return await response.json()
}

// Create a table for the restaurant
export async function createRestaurantTableService(restaurant_id, tableData) {
    const token = localStorage.getItem("waitertoken") || localStorage.getItem("cheftoken")
    const newTable = {
        number: tableData.number,
        status: tableData.status,
        location: tableData.location
    }
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/tables`, {
        method: "POST",
        body: JSON.stringify(newTable),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Error creating table")
    return await response.json()
}

// Edit a table of the restaurant
export async function editRestaurantTableService(restaurant_id, table_id, tableData) {
    const token = localStorage.getItem("waitertoken") || localStorage.getItem("cheftoken")
    const editedTable = {
        number: tableData.number,
        status: tableData.status,
        location: tableData.location,
        active: tableData.active
    }
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/tables/${table_id}`, {
        method: "PUT",
        body: JSON.stringify(editedTable),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Error editing table")
    return await response.json()
}

// Deactivate a table of the restaurant (soft delete)
export async function deactivateRestaurantTableService(restaurant_id, table_id) {
    const token = localStorage.getItem("waitertoken") || localStorage.getItem("cheftoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/tables/${table_id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Error deactivating table")
    const data = await response.json()
    return data.message
}