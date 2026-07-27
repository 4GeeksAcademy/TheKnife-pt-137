import { useNavigate } from "react-router-dom";
import { 
    getRecipesService, 
    getSingleRecipeService, 
    createRecipeService, 
    deleteRecipeService, 
    editRecipeService 
} from "../services/recipeService";
import useGlobalReducer from "./useGlobalReducer";

export function useRecipe() {

    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    async function getRecipes() {
        try {
            const data = await getRecipesService()
            dispatch({ type: "set_recipes", payload: data })
        } catch (error) {
            console.log(error)
        }
    }

    async function getSingleRecipe(recipeId) {
        try {
            const recipe = await getSingleRecipeService(recipeId)
            dispatch({ type: "set_single_recipe", payload: recipe })
        } catch (error) {
            console.log(error)
        }
    }

    async function createRecipe(recipeData) {
        try {
            const response = await createRecipeService(recipeData)
            const data = await response.json()
            console.log(data)
            navigate("/recipes")
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteRecipe(recipeId) {
        try {
            const message = await deleteRecipeService(recipeId)
            console.log(message)
            getRecipes()
        } catch (error) {
            console.log(error)
        }
    }

    async function editRecipe(recipeId, recipeData) {
        try {
            const response = await editRecipeService(recipeId, recipeData)
            const data = await response.json()
            console.log(data)
            navigate("/recipes")
        } catch (error) {
            console.log(error)
        }
    }

    return {
        getRecipes,
        getSingleRecipe,
        createRecipe,
        deleteRecipe,
        editRecipe
    }
}
