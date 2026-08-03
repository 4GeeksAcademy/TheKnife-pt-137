const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// GET: obtener todas las relaciones receta–ingrediente
export const getRecipeIngredients = async () => {
    const response = await fetch(`${BASE_URL}/recipe-ingredients`);
    return response.json();
};

// GET: obtener una relación concreta por ID
export const getSingleRecipeIngredient = async (id) => {
    const response = await fetch(`${BASE_URL}/recipe-ingredients/${id}`);
    return response.json();
};

// GET: obtener los ingredientes de UNA receta concreta
export const getRecipeIngredientsByRecipe = async (recipeId) => {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/ingredients`);
    return response.json();
};

// POST: crear una nueva relación receta–ingrediente
export const createRecipeIngredient = async (data) => {
    const response = await fetch(`${BASE_URL}/recipe-ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
};

// PUT: editar una relación receta–ingrediente
export const editRecipeIngredient = async (id, data) => {
    const response = await fetch(`${BASE_URL}/recipe-ingredients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
};

// DELETE: eliminar una relación receta–ingrediente
export const deleteRecipeIngredient = async (id) => {
    const response = await fetch(`${BASE_URL}/recipe-ingredients/${id}`, {
        method: "DELETE"
    });
    return response.json();
};