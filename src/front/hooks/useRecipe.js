//este archivo es para completar la llamada hacia a la api para que pueda usar con los componenetes

// Importamos cosas necesarias para navegar entre páginas
import { useNavigate } from "react-router-dom";

// Importamos las funciones que hablan con la API de recetas
// Estas funciones hacen el fetch a Flask
import { 
    getRecipesService, 
    getSingleRecipeService, 
    createRecipeService, 
    deleteRecipeService, 
    editRecipeService 
} from "../services/recipeService";

// Importamos nuestro global reducer para guardar datos en el store
import useGlobalReducer from "./useGlobalReducer";

export function useRecipe() {

    // Aquí obtenemos el store (donde guardamos datos globales)
    // y dispatch (para cambiar esos datos)
    const { store, dispatch } = useGlobalReducer()

    // Esto sirve para cambiar de página después de crear o editar
    const navigate = useNavigate()


    // GET todas las recetas
    async function getRecipes() {
        try {
            // Llamamos al servicio que hace fetch a /recipes
            const data = await getRecipesService()

            // Guardamos las recetas en el store global
            dispatch({ type: "set_recipes", payload: data })

        } catch (error) {
            console.log(error)
        }
    }


    // GET una receta concreta
    async function getSingleRecipe(recipeId) {
        try {
            // Llamamos al servicio que trae una receta por id
            const recipe = await getSingleRecipeService(recipeId)

            // Guardamos esa receta en el store global
            dispatch({ type: "set_single_recipe", payload: recipe })

        } catch (error) {
            console.log(error)
        }
    }


    // Crear una receta nueva
    async function createRecipe(recipeData) {
        try {
            // Enviamos los datos al backend para crear la receta
            const response = await createRecipeService(recipeData)

            // Convertimos la respuesta en JSON
            const data = await response.json()
            console.log(data)

            // Después de crear, navegamos a la lista de recetas
            navigate("/recipes")

        } catch (error) {
            console.log(error)
        }
    }


    // Eliminar una receta
    async function deleteRecipe(recipeId) {
        try {
            // Llamamos al servicio que elimina la receta
            const message = await deleteRecipeService(recipeId)
            console.log(message)

            // Después de borrar, recargamos la lista
            getRecipes()

        } catch (error) {
            console.log(error)
        }
    }


    // Editar una receta
    async function editRecipe(recipeId, recipeData) {
        try {
            // Enviamos los nuevos datos al backend
            const response = await editRecipeService(recipeId, recipeData)

            // Convertimos la respuesta en JSON
            const data = await response.json()
            console.log(data)

            // Después de editar, volvemos a la lista
            navigate("/recipes")

        } catch (error) {
            console.log(error)
        }
    }


    // Devolvemos todas las funciones para usarlas en los componentes
    return {
        getRecipes,
        getSingleRecipe,
        createRecipe,
        deleteRecipe,
        editRecipe
    }
}
