const BASE_URL = import.meta.env.VITE_BACKEND_URL; 
// Ej: http://localhost:3001 o tu URL de Render

export const getIngredients = async () => {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${BASE_URL}/ingredients`, {
        headers: { "Authorization": `Bearer ${managerToken}` }
    });
    return response.json();
};

export const getSingleIngredient = async (id) => {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
        headers: { "Authorization": `Bearer ${managerToken}` }
    });
    return response.json();
};

export const createIngredient = async (data) => {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${BASE_URL}/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${managerToken}` },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const editIngredient = async (id, data) => {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${managerToken}` },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteIngredient = async (id) => {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${BASE_URL}/ingredients/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${managerToken}` }
    });
    return response.json();
};

/////////////////////////////////////////////////////////////////////////
// Chef gets all active ingredients
export async function getActiveIngredientsService() {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${BASE_URL}/chef/ingredients`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${chefToken}` }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    const data = await response.json()
    return data
}

// Chef gets all inactive ingredients
export async function getInactiveIngredientsService() {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${BASE_URL}/chef/ingredients/inactive`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${chefToken}` }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    const data = await response.json()
    return data
}

// Chef gets one ingredient
export async function getOneIngredientService(ingredient_id) {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${BASE_URL}/chef/ingredients/${ingredient_id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${chefToken}` }
    })
    if (response.status === 404) throw new Error("Ingredient not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data
    }
}

// Chef creates an ingredient
export async function chefCreateIngredientService(ingredientData) {
    const chefToken = localStorage.getItem("cheftoken")
    const newIngredient = {
        name: ingredientData.name,
        img_url: ingredientData.img_url
    }
    const response = await fetch(`${BASE_URL}/chef/create_ingredient`, {
        method: "POST",
        body: JSON.stringify(newIngredient),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    const data = await response.json()
    return data
}

// Chef edits an ingredient
export async function chefEditIngredientService(ingredient_id, ingredientData) {
    const chefToken = localStorage.getItem("cheftoken")
    const editedIngredient = {
        name: ingredientData.name,
        img_url: ingredientData.img_url,
        active: ingredientData.active
    }
    const response = await fetch(`${BASE_URL}/chef/ingredients/${ingredient_id}`, {
        method: "PUT",
        body: JSON.stringify(editedIngredient),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (response.status === 404) throw new Error("Ingredient not found")
    else if (response.status === 200) return response
}

// Chef deactivates an ingredient (soft delete — ingredients are shared across restaurants)
export async function deactivateIngredientService(ingredient_id) {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${BASE_URL}/chef/deactivate_ingredient/${ingredient_id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${chefToken}` }
    })
    if (response.status === 404) throw new Error("Ingredient not found")
    else if (response.status === 200) {
        const data = await response.json()
        return data
    }
}
