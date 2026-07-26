// Guardamos la URL del backend en una constante
// Así no repetimos import.meta.env.VITE_BACKEND_URL en cada fetch
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


// Esta función trae TODAS las recetas desde el backend
export async function getRecipesService() {
    // Hacemos una petición GET a /recipes usando la variable de entorno
    const response = await fetch(BACKEND_URL + "/recipes")

    // Convertimos la respuesta en JSON
    const data = await response.json()

    // Devolvemos las recetas
    return data
}


// Esta función trae UNA receta concreta por su id
export async function getSingleRecipeService(recipeId) {
    // Hacemos una petición GET a /recipes/id
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`)

    // Convertimos la respuesta en JSON
    const data = await response.json()

    // Devolvemos la receta
    return data
}


// Esta función crea una receta nueva
export async function createRecipeService(recipeData) {
    // Hacemos una petición POST a /recipes
    const response = await fetch(BACKEND_URL + "/recipes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipeData)
    })

    // Devolvemos la respuesta para que el hook la convierta en JSON
    return response
}


// Esta función elimina una receta por id
export async function deleteRecipeService(recipeId) {
    // Hacemos una petición DELETE a /recipes/id
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`, {
        method: "DELETE"
    })

    // Convertimos la respuesta en JSON
    const data = await response.json()

    // Devolvemos el mensaje del backend
    return data
}


// Esta función edita una receta existente
export async function editRecipeService(recipeId, recipeData) {
    // Hacemos una petición PUT a /recipes/id
    const response = await fetch(BACKEND_URL + `/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipeData)
    })

    // Devolvemos la respuesta para que el hook la convierta en JSON
    return response
}
