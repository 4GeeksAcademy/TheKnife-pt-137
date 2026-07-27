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

