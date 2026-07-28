const backendURL = import.meta.env.VITE_BACKEND_URL;

// GET all tables
export async function getTablesService() {
    const response = await fetch(`${backendURL}/tables`);
    if (!response.ok) throw new Error("Error fetching tables");
    return await response.json();
}

// GET single table
export async function getSingleTableService(tableId) {
    const response = await fetch(`${backendURL}/tables/${tableId}`);
    if (!response.ok) throw new Error("Table not found");
    return await response.json();
}

// Create new table
export async function createTableService(tableData) {
    const newTable = {
        number: tableData.number,
        status: tableData.status,
        location: tableData.location,
    };

    const response = await fetch(`${backendURL}/tables`, {
        method: "POST",
        body: JSON.stringify(newTable),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) throw new Error("Error creating table");
    return await response.json();
}

// Delete table
export async function deleteTableService(tableId) {
    const response = await fetch(`${backendURL}/tables/${tableId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) throw new Error("Table not found");
    const data = await response.json();
    return data.message;
}

// Edit table
export async function editTableService(tableId, tableData) {
    const editedTable = {
        number: tableData.number,
        status: tableData.status, // Corregido: antes tenías 'state'
        location: tableData.location
    };

    const response = await fetch(`${backendURL}/tables/${tableId}`, {
        method: "PUT",
        body: JSON.stringify(editedTable),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error editing table");
    }

    return await response.json(); // Corregido: ahora devuelve el objeto JSON
}