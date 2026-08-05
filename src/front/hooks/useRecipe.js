import { useNavigate } from "react-router-dom";
import {
  getRecipesService,
  getSingleRecipeService,
  createRecipeService,
  deleteRecipeService,
  editRecipeService,
  getAllRestaurantRecipesService,
  deleteRestaurantRecipeService,
  chefCreateRecipeService,
  getOneRestaurantRecipeService,
  chefEditRecipeService
} from "../services/recipeService";

import useGlobalReducer from "./useGlobalReducer";
export function useRecipe() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  async function getRecipes() {
    try {
      const data = await getRecipesService();
      dispatch({ type: "set_recipes", payload: data });
    } catch (error) {
      console.log(error);
    }
  }
  async function getSingleRecipe(recipeId) {
    try {
      const recipe = await getSingleRecipeService(recipeId);
      dispatch({ type: "set_single_recipe", payload: recipe });
    } catch (error) {
      console.log(error);
    }
  }
  async function createRecipe(recipeData) {
    try {
      const response = await createRecipeService(recipeData);
      const data = await response.json();
      console.log(data);
      navigate("/recipes");
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteRecipe(recipeId) {
    try {
      const message = await deleteRecipeService(recipeId);
      console.log(message);
      getRecipes();
    } catch (error) {
      console.log(error);
    }
  }
  async function editRecipe(recipeId, recipeData) {
    try {
      const response = await editRecipeService(recipeId, recipeData);
      const data = await response.json();
      console.log(data);
      navigate("/recipes");
    } catch (error) {
      console.log(error);
    }
  }

  /////////////////////////////////////////////////
  // Get all restaurant recipes
  async function getAllRestaurantRecipes(restaurant_id) {
    try {
      const data = await getAllRestaurantRecipesService(restaurant_id);
      dispatch({
        type: "set_recipes",
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Chef deletes a recipe of his restaurant
  async function deleteRestaurantRecipe(restaurant_id, recipe_id) {
    try {
      const data = await deleteRestaurantRecipeService(
        restaurant_id,
        recipe_id,
      );
      console.log(data);
      getAllRestaurantRecipes(restaurant_id);
    } catch (error) {
      console.log(error);
    }
  }

  // Chef creates a recipe
  async function chefCreateRecipe(restaurant_id, recipeData) {
    try {
      const data = await chefCreateRecipeService(restaurant_id, recipeData);
      console.log(data);
      navigate("/chef_dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  // Chef or cook gets one recipe of the restaurant
  async function getOneRestaurantRecipe(restaurant_id, recipe_id) {
    try {
      const recipe = await getOneRestaurantRecipeService(restaurant_id, recipe_id);
      dispatch({ type: "set_single_recipe", payload: recipe });
    } catch (error) {
      console.log(error);
    }
  }

  // Chef edits recipe of his restaurant
  async function chefEditRecipe(restaurant_id, recipe_id, recipeData) {
    try {
      const response = await chefEditRecipeService(restaurant_id, recipe_id, recipeData);
      const data = await response.json();
      console.log(data);
      navigate("/chef_dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getRecipes,
    getSingleRecipe,
    createRecipe,
    deleteRecipe,
    editRecipe,
    getAllRestaurantRecipes,
    deleteRestaurantRecipe,
    chefCreateRecipe,
    getOneRestaurantRecipe,
    chefEditRecipe
  };
}
