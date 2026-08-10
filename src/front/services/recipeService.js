const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export async function getRecipesService() {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(BACKEND_URL + "/recipes", {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    })
    const data = await response.json()
    return data
}

export async function getSingleRecipeService(recipeId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    })
    const data = await response.json()
    return data
}

export async function createRecipeService(recipeData) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(BACKEND_URL + "/recipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        },
        body: JSON.stringify(recipeData)
    })
    return response
}

export async function deleteRecipeService(recipeId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    })
    const data = await response.json()
    return data
}

export async function editRecipeService(recipeId, recipeData) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        },
        body: JSON.stringify(recipeData)
    })
    return response
}
/////////////////////////////////////////////////////////////////////////
// Get all recipes
export async function getAllRestaurantRecipesService(restaurant_id) {
    const token = localStorage.getItem("cheftoken") || localStorage.getItem("cooktoken")
    const response = await fetch(`${BACKEND_URL}/restaurants/${restaurant_id}/recipes`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred");
    else if (response.ok) {
        const data = await response.json()
        return data;
    }
}

// Chef can delete recipes of his restaurant
export async function deleteRestaurantRecipeService(restaurant_id, recipe_id) {
  const chefToken = localStorage.getItem("cheftoken")
  const response = await fetch(`${BACKEND_URL}/restaurants/${restaurant_id}/recipes/${recipe_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${chefToken}`
    }
  })
  if (!response.ok) throw new Error("Some error has ocurred")
  else if (response.ok) {
    const data = await response.json()
    return data
  }
}

// GET one recipe
export async function getOneRestaurantRecipeService(restaurant_id, recipe_id) {
    const token = localStorage.getItem("cheftoken") || localStorage.getItem("cooktoken")
    const response = await fetch(`${BACKEND_URL}/restaurants/${restaurant_id}/recipes/${recipe_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (response.status === 404) throw new Error("Recipe not found")
    else if (response.status === 200) {
        const recipe = await response.json()
        return recipe;
    }
}

// Chef edits a recipe of his restaurant
export async function chefEditRecipeService(restaurant_id, recipe_id, recipeData) {
    const chefToken = localStorage.getItem("cheftoken")
    const editedRecipe = {
        name: recipeData.name,
        steps: recipeData.steps,
        img_url: recipeData.img_url
    }
    const response = await fetch(`${BACKEND_URL}/restaurants/${restaurant_id}/recipes/${recipe_id}`, {
        method: "PUT",
        body: JSON.stringify(editedRecipe),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (response.status === 404) throw new Error("Recipe not found")
    else if (response.status === 200) return response;
}

// Chef uploads a dish photo and gets back an AI-generated recipe suggestion
// (name, steps and ingredients). Nothing is saved to the database yet.
export async function generateRecipeFromImageService(restaurant_id, img_url) {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${BACKEND_URL}/restaurants/${restaurant_id}/generate_recipe`, {
        method: "POST",
        body: JSON.stringify({ img_url }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Some error has ocurred")
    }
    const data = await response.json()
    return data
}

// Chef asks the AI to estimate the calories of a recipe from its saved
// ingredients. The backend saves the result and returns the updated recipe.
export async function calculateRecipeCaloriesService(restaurant_id, recipe_id) {
    const chefToken = localStorage.getItem("cheftoken")
    const response = await fetch(`${BACKEND_URL}/restaurants/${restaurant_id}/recipes/${recipe_id}/calculate_calories`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${chefToken}`
        }
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Some error has ocurred")
    }
    const data = await response.json()
    return data
}

// Chef creates a recipe
export async function chefCreateRecipeService(restaurant_id, recipeData) {
    const chefToken = localStorage.getItem("cheftoken")
    const newRecipe = {
        name: recipeData.name,
        steps: recipeData.steps,
        img_url: recipeData.img_url
    }
    const response = await fetch(`${BACKEND_URL}/restaurants/${restaurant_id}/create_recipe`, {
        method: "POST",
        body: JSON.stringify(newRecipe),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    console.log(response)
    if (!response.ok) throw new Error("Some error has ocurred")
    else if (response.ok) {
        const data = await response.json()
        return data
    }
}