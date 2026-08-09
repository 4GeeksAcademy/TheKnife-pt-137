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