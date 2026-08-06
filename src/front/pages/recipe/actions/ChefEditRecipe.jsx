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
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit recipe</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setRecipeData({ ...recipeData, name: e.target.value })} value={recipeData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="steps">Steps</label>
                        <textarea className="form-control" onChange={(e) => setRecipeData({ ...recipeData, steps: e.target.value })} value={recipeData.steps} name="steps" id="steps" />
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setRecipeData, recipeData)} />
                    </div>

                    <button onClick={() => chefEditRecipe(restaurant_id, recipe_id, recipeData)} className="btn btn-primary w-100 mb-3">Edit recipe</button>

                    <div className="text-center">
                        <Link to={`/restaurants/${restaurant_id}/recipes`}>
                            Volver a recetas
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default ChefEditRecipe;
