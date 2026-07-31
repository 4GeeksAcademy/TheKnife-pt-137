import React, { useState } from "react";
import { useIngredient } from "../../hooks/useIngredient";
import { Link } from "react-router-dom";

const CreateIngredientForm = () => {

    const [ingredientData, setIngredientData] = useState({ name: "", img_url: "" })
    const { addIngredient } = useIngredient()

    return (
        <div className="ingredient_form d-flex flex-column align-items-center gap-3">
            <h1>Create new ingredient</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e) => setIngredientData({ ...ingredientData, name: e.target.value })} value={ingredientData.name} type="text" name="name" id="name" />
            </div>
            <input
                type="file"
                onChange={async (e) => {
                    const image = e.target.files[0]
                    const formData = new FormData()
                    formData.append("file", image)
                    formData.append("upload_preset", "cocinapp_images")
                    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
                        method: "POST",
                        body: formData
                    })
                    const data = await response.json()
                    setIngredientData({
                        ...ingredientData,
                        img_url: data.secure_url
                    })
                }}
            />
            <button onClick={() => addIngredient(ingredientData)} className="btn btn-primary">Create new ingredient</button>
            <Link to="/ingredients">Back to ingredients</Link>
        </div>
    )
}

export default CreateIngredientForm;