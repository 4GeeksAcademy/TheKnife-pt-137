const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export async function getRecipesService() {
    const response = await fetch(BACKEND_URL + "/recipes")
    const data = await response.json()
    return data
}

export async function getSingleRecipeService(recipeId) {
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`)
    const data = await response.json()
    return data
}

export async function createRecipeService(recipeData) {
    const response = await fetch(BACKEND_URL + "/recipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipeData)
    })
    return response
}

export async function deleteRecipeService(recipeId) {
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`, {
        method: "DELETE"
    })
    const data = await response.json()
    return data
}

export async function editRecipeService(recipeId, recipeData) {
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
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