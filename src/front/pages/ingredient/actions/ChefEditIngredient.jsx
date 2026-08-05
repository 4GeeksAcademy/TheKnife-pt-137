import React, { useEffect, useState } from "react";
import { useIngredient } from "../../../hooks/useIngredient";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useCloudinary } from "../../../hooks/useCloudinary";

const ChefEditIngredient = () => {

    const { store } = useGlobalReducer()
    const [ingredientData, setIngredientData] = useState({ name: "", img_url: "", active: true })
    const { fetchChefSingleIngredient, chefEditIngredient } = useIngredient()
    const { ingredient_id } = useParams()
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        fetchChefSingleIngredient(ingredient_id)
    }, [])

    useEffect(() => {
        if (store.singleIngredient.id) {
            setIngredientData({
                name: store.singleIngredient.name,
                img_url: store.singleIngredient.img_url,
                active: store.singleIngredient.active
            })
        }
    }, [store.singleIngredient])

    return (
        <div className="ingredient_form d-flex flex-column align-items-center gap-3">
            <h1>Edit ingredient</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e) => setIngredientData({ ...ingredientData, name: e.target.value })} value={ingredientData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="active">Active</label>
                <input onChange={(e) => setIngredientData({ ...ingredientData, active: e.target.checked })} checked={ingredientData.active} type="checkbox" name="active" id="active" />
            </div>
            <input type="file" onChange={(e) => uploadImage(e, "cocinapp_images", setIngredientData, ingredientData)} />
            <button onClick={() => chefEditIngredient(ingredient_id, ingredientData)} className="btn btn-primary">Edit ingredient</button>
            <Link to="/chef_ingredients">Back to ingredients</Link>
        </div>
    )
}

export default ChefEditIngredient;
