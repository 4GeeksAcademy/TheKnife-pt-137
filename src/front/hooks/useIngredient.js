import { useState, useEffect } from "react";
import useGlobalReducer from "./useGlobalReducer";
import { useNavigate } from "react-router-dom";

import {
    getIngredients,
    getSingleIngredient,
    createIngredient,
    editIngredient,
    deleteIngredient,
    getActiveIngredientsService,
    getInactiveIngredientsService,
    getOneIngredientService,
    chefCreateIngredientService,
    chefEditIngredientService,
    deactivateIngredientService
} from "../services/ingredientService";

export const useIngredient = () => {
    const {store, dispatch} = useGlobalReducer();
    const navigate = useNavigate();

    const fetchIngredients = async () => {
        const data = await getIngredients();
        dispatch({ type: "set_ingredients", payload: data });
    };

    const fetchSingleIngredient = async (id) => {
        const data = await getSingleIngredient(id);
        dispatch({ type: "set_single_ingredient", payload: data });
    };

    const addIngredient = async (ingredientData) => {
        const newIng = await createIngredient(ingredientData);
        console.log("New ingredient created:", newIng);
        navigate("/ingredients");
    };

    const updateIngredient = async (id, ingredientData) => {
        const updated = await editIngredient(id, ingredientData);
        console.log("Ingredient updated:", updated);
        navigate("/ingredients");
    };

    const removeIngredient = async (id) => {
        await deleteIngredient(id);
        fetchIngredients();
    };

    /////////////////////////////////////////////////
    // Chef gets all active ingredients
    async function fetchActiveIngredients() {
        try {
            const data = await getActiveIngredientsService()
            dispatch({type: "set_ingredients", payload: data})
        } catch (error) {console.log(error)}
    }

    // Chef gets all inactive ingredients
    async function fetchInactiveIngredients() {
        try {
            const data = await getInactiveIngredientsService()
            dispatch({type: "set_inactive_ingredients", payload: data})
        } catch (error) {console.log(error)}
    }

    // Chef gets one ingredient
    async function fetchChefSingleIngredient(ingredient_id) {
        try {
            const data = await getOneIngredientService(ingredient_id)
            dispatch({type: "set_single_ingredient", payload: data})
        } catch (error) {console.log(error)}
    }

    // Chef creates an ingredient
    async function chefCreateIngredient(ingredientData) {
        try {
            const data = await chefCreateIngredientService(ingredientData)
            console.log(data)
            navigate("/chef_dashboard")
        } catch (error) {console.log(error)}
    }

    // Chef edits an ingredient
    async function chefEditIngredient(ingredient_id, ingredientData) {
        try {
            const response = await chefEditIngredientService(ingredient_id, ingredientData)
            const data = await response.json()
            console.log(data)
            navigate("/chef_dashboard")
        } catch (error) {console.log(error)}
    }

    // Chef deactivates an ingredient (soft delete)
    async function deactivateIngredient(ingredient_id) {
        try {
            const data = await deactivateIngredientService(ingredient_id)
            console.log(data)
            fetchActiveIngredients()
        } catch (error) {console.log(error)}
    }

    return {
        fetchIngredients,
        fetchSingleIngredient,
        addIngredient,
        updateIngredient,
        removeIngredient,
        fetchActiveIngredients,
        fetchInactiveIngredients,
        fetchChefSingleIngredient,
        chefCreateIngredient,
        chefEditIngredient,
        deactivateIngredient
    };
};
