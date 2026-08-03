import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";

import {
    getRecipeIngredients,
    getSingleRecipeIngredient,
    getRecipeIngredientsByRecipe,
    createRecipeIngredient,
    editRecipeIngredient,
    deleteRecipeIngredient
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

    return {
        fetchRecipeIngredients,
        fetchSingleRecipeIngredient,
        fetchRecipeIngredientsByRecipe,
        addRecipeIngredient,
        updateRecipeIngredient,
        removeRecipeIngredient
    };
};