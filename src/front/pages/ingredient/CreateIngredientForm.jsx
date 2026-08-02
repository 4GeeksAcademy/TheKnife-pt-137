import React, { useState } from "react";
import { useIngredient } from "../../hooks/useIngredient";
import { Link } from "react-router-dom";
import { useCloudinary } from "../../hooks/useCloudinary";

const CreateIngredientForm = () => {

    const [ingredientData, setIngredientData] = useState({ name: "", img_url: "" })
    const { uploadImage } = useCloudinary()
    const { addIngredient } = useIngredient()

    return (
        <div className="ingredient_form d-flex flex-column align-items-center gap-3">
            <h1>Create new ingredient</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e) => setIngredientData({ ...ingredientData, name: e.target.value })} value={ingredientData.name} type="text" name="name" id="name" />
            </div>
            <input type="file" onChange={(e)=>uploadImage(e,"cocinapp_images",setIngredientData,ingredientData)} />
            <button onClick={() => addIngredient(ingredientData)} className="btn btn-primary">Create new ingredient</button>
            <Link to="/ingredients">Back to ingredients</Link>
        </div>
    )
}

export default CreateIngredientForm;