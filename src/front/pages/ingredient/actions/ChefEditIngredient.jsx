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
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit ingredient</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setIngredientData({ ...ingredientData, name: e.target.value })} value={ingredientData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3 form-check">
                        <input className="form-check-input" onChange={(e) => setIngredientData({ ...ingredientData, active: e.target.checked })} checked={ingredientData.active} type="checkbox" name="active" id="active" />
                        <label className="form-check-label" htmlFor="active">Active</label>
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setIngredientData, ingredientData)} />
                    </div>

                    <button onClick={() => chefEditIngredient(ingredient_id, ingredientData)} className="btn btn-primary w-100 mb-3">Edit ingredient</button>

                    <div className="text-center">
                        <Link to="/chef_ingredients">Back to ingredients</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default ChefEditIngredient;
