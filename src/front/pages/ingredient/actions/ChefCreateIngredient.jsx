import React, { useState } from "react";
import { useIngredient } from "../../../hooks/useIngredient";
import { Link } from "react-router-dom";
import { useCloudinary } from "../../../hooks/useCloudinary";

const ChefCreateIngredient = () => {

    const [ingredientData, setIngredientData] = useState({ name: "", img_url: "" })
    const { uploadImage } = useCloudinary()
    const { chefCreateIngredient } = useIngredient()

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new ingredient</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setIngredientData({ ...ingredientData, name: e.target.value })} value={ingredientData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setIngredientData, ingredientData)} />
                    </div>

                    <button onClick={() => chefCreateIngredient(ingredientData)} className="btn btn-primary w-100 mb-3">Create new ingredient</button>

                    <div className="text-center">
                        <Link to="/chef_ingredients">Back to ingredients</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default ChefCreateIngredient;
