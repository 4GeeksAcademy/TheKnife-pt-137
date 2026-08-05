import React, { useEffect, useState } from "react";
import { useRecipe } from "../../../hooks/useRecipe";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useCloudinary } from "../../../hooks/useCloudinary";

const ChefEditRecipe = () => {

    const { store } = useGlobalReducer()
    const [recipeData, setRecipeData] = useState({ name: "", steps: "", img_url: "" })
    const { getOneRestaurantRecipe, chefEditRecipe } = useRecipe()
    const { restaurant_id, recipe_id } = useParams()
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        getOneRestaurantRecipe(restaurant_id, recipe_id)
    }, [])

    useEffect(() => {
        if (store.single_recipe.id) {
            setRecipeData({
                name: store.single_recipe.name,
                steps: store.single_recipe.steps,
                img_url: store.single_recipe.img_url
            })
        }
    }, [store.single_recipe])

    return (
        <div className="recipe_form d-flex flex-column align-items-center gap-3">
            <h1>Edit recipe</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e) => setRecipeData({ ...recipeData, name: e.target.value })} value={recipeData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="steps">Steps</label>
                <textarea onChange={(e) => setRecipeData({ ...recipeData, steps: e.target.value })} value={recipeData.steps} name="steps" id="steps" />
            </div>
            <input type="file" onChange={(e) => uploadImage(e, "cocinapp_images", setRecipeData, recipeData)} />
            <button onClick={() => chefEditRecipe(restaurant_id, recipe_id, recipeData)} className="btn btn-primary">Edit recipe</button>
            <Link to="/chef_dashboard">Back to dashboard</Link>
        </div>
    )
}

export default ChefEditRecipe;
