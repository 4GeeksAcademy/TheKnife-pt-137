import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";

import {
    getRecipeIngredients,
    getSingleRecipeIngredient,
    getRecipeIngredientsByRecipe,
    createRecipeIngredient,
    editRecipeIngredient,
    deleteRecipeIngredient,
    getRestaurantRecipeIngredientsService,
    chefAddRecipeIngredientService,
    chefEditRecipeIngredientService,
    chefDeleteRecipeIngredientService
} from "../services/recipeIngredientService";

export const useRecipeIngredient = () => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // GET todas las relaciones receta–ingrediente
    const fetchRecipeIngredients = async () => {
        const data = await getRecipeIngredients();
        dispatch({ type: "set_recipe_ingredients", payload: data });
    };

    // GET una relación concreta
    const fetchSingleRecipeIngredient = async (id) => {
        const data = await getSingleRecipeIngredient(id);
        dispatch({ type: "set_single_recipe_ingredient", payload: data });
    };

    // GET los ingredientes de UNA receta concreta
    const fetchRecipeIngredientsByRecipe = async (recipeId) => {
        const data = await getRecipeIngredientsByRecipe(recipeId);
        dispatch({ type: "set_recipe_ingredients", payload: data });
    };

    // POST crear relación receta–ingrediente
    const addRecipeIngredient = async (recipeIngredientData) => {
        const newRelation = await createRecipeIngredient(recipeIngredientData);
        console.log("Nueva relación creada:", newRelation);

        // Navegamos a la receta correspondiente
        navigate(`/recipe/${recipeIngredientData.recipe_id}`);
    };

    // PUT editar relación receta–ingrediente
    const updateRecipeIngredient = async (id, recipeIngredientData) => {
        const updatedRelation = await editRecipeIngredient(id, recipeIngredientData);
        console.log("Relación actualizada:", updatedRelation);

        navigate(`/recipe/${recipeIngredientData.recipe_id}`);
    };

    // DELETE eliminar relación receta–ingrediente
    const removeRecipeIngredient = async (id, recipeId) => {
        await deleteRecipeIngredient(id);

        // Recargar ingredientes de la receta
        fetchRecipeIngredientsByRecipe(recipeId);

        navigate(`/recipe/${recipeId}`);
    };

    // GET the ingredients of a recipe of the restaurant (chef or cook)
    async function fetchRestaurantRecipeIngredients(restaurant_id, recipe_id) {
        try {
            const data = await getRestaurantRecipeIngredientsService(restaurant_id, recipe_id)
            dispatch({ type: "set_recipe_ingredients", payload: data })
        } catch (error) { console.log(error) }
    }

    // Chef adds an ingredient to a recipe of his restaurant
    async function chefAddRecipeIngredient(restaurant_id, recipe_id, recipeIngredientData) {
        try {
            const data = await chefAddRecipeIngredientService(restaurant_id, recipe_id, recipeIngredientData)
            console.log(data)
            fetchRestaurantRecipeIngredients(restaurant_id, recipe_id)
        } catch (error) { console.log(error) }
    }

    // Chef edits an ingredient of a recipe of his restaurant
    async function chefUpdateRecipeIngredient(restaurant_id, recipe_id, recipe_ingredient_id, recipeIngredientData) {
        try {
            const data = await chefEditRecipeIngredientService(restaurant_id, recipe_id, recipe_ingredient_id, recipeIngredientData)
            console.log(data)
            fetchRestaurantRecipeIngredients(restaurant_id, recipe_id)
        } catch (error) { console.log(error) }
    }

    // Chef removes an ingredient from a recipe of his restaurant
    async function chefRemoveRecipeIngredient(restaurant_id, recipe_id, recipe_ingredient_id) {
        try {
            const data = await chefDeleteRecipeIngredientService(restaurant_id, recipe_id, recipe_ingredient_id)
            console.log(data)
            fetchRestaurantRecipeIngredients(restaurant_id, recipe_id)
        } catch (error) { console.log(error) }
    }

    return {
        fetchRecipeIngredients,
        fetchSingleRecipeIngredient,
        fetchRecipeIngredientsByRecipe,
        addRecipeIngredient,
        updateRecipeIngredient,
        removeRecipeIngredient,
        fetchRestaurantRecipeIngredients,
        chefAddRecipeIngredient,
        chefUpdateRecipeIngredient,
        chefRemoveRecipeIngredient
    };
};