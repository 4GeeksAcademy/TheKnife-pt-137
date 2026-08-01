const BASE_URL = import.meta.env.VITE_BACKEND_URL; 
// Ej: http://localhost:3001 o tu URL de Render

export const getIngredients = async () => {
    const response = await fetch(`${BASE_URL}/ingredients`);
    return response.json();
};

export const getSingleIngredient = async (id) => {
    const response = await fetch(`${BASE_URL}/ingredients/${id}`);
    return response.json();
};

export const createIngredient = async (data) => {
    const response = await fetch(`${BASE_URL}/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const editIngredient = async (id, data) => {
    const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteIngredient = async (id) => {
    const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
        method: "DELETE"
    });
    return response.json();
};
