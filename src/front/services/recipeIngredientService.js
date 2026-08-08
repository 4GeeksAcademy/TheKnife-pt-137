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

/////////////////////////////////////////////////////////////////////////
// Chef or cook gets the ingredients of a recipe of their restaurant
export async function getRestaurantRecipeIngredientsService(restaurant_id, recipe_id) {
    const token = localStorage.getItem("cheftoken") || localStorage.getItem("cooktoken")
    const response = await fetch(`${BASE_URL}/restaurants/${restaurant_id}/recipes/${recipe_id}/ingredients`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    const data = await response.json()
    return data
}

// Chef adds an ingredient to a recipe of his restaurant
export async function chefAddRecipeIngredientService(restaurant_id, recipe_id, recipeIngredientData) {
    const chefToken = localStorage.getItem("cheftoken")
    const newRecipeIngredient = {
        ingredient_id: recipeIngredientData.ingredient_id,
        amount: recipeIngredientData.amount
    }
    const response = await fetch(`${BASE_URL}/restaurants/${restaurant_id}/recipes/${recipe_id}/ingredients`, {
        method: "POST",
        body: JSON.stringify(newRecipeIngredient),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    const data = await response.json()
    return data
}

// Chef edits an ingredient of a recipe of his restaurant
export async function chefEditRecipeIngredientService(restaurant_id, recipe_id, recipe_ingredient_id, recipeIngredientData) {
    const chefToken = localStorage.getItem("cheftoken")
    const editedRecipeIngredient = {
        ingredient_id: recipeIngredientData.ingredient_id,
        amount: recipeIngredientData.amount
    }
    const response = await fetch(`${BASE_URL}/restaurants/${restaurant_id}/recipes/${recipe_id}/ingredients/${recipe_ingredient_id}`, {
        method: "PUT",
        body: JSON.stringify(editedRecipeIngredient),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    const data = await response.json()
    return data
}

// Chef removes an ingredient from a recipe of his restaurant
export async function chefDeleteRecipeIngredientService(restaurant_id, recipe_id, recipe_ingredient_id) {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${BASE_URL}/restaurants/${restaurant_id}/recipes/${recipe_id}/ingredients/${recipe_ingredient_id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    const data = await response.json()
    return data
}