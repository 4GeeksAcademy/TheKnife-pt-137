import { useState, useEffect } from "react";
import useGlobalReducer from "./useGlobalReducer";
import { useNavigate } from "react-router-dom";

import {
    getIngredients,
    getSingleIngredient,
    createIngredient,
    editIngredient,
    deleteIngredient
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

    return {
        fetchIngredients,
        fetchSingleIngredient,
        addIngredient,
        updateIngredient,
        removeIngredient
    };
};
