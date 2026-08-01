//crear una nueva receta nueva 

import React, { useState } from "react"
import { useRecipe } from "../../hooks/useRecipe"
import { Link } from "react-router-dom"
import { useCloudinary } from "../../hooks/useCloudinary"


function CreateRecipeForm() {

    const { createRecipe } = useRecipe()

    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")
    const [img_url, setImg_url] = useState("")
    const { uploadImage } = useCloudinary()    

    function handleSubmit(e) {
        e.preventDefault()
        const recipeData = {
            name: name,
            steps: steps,
            img_url: img_url.img_url
        }
        console.log(recipeData.img_url)
        createRecipe(recipeData)
    }

    return (
        <div>
            <h1>Crear receta</h1>

            <form onSubmit={handleSubmit}>

                <label>Nombre de la receta</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label>Pasos</label>
                <textarea
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                />

                <input type="file" onChange={(e)=>uploadImage(e,"cocinapp_images",setImg_url, img_url)} />
                <button type="submit">Crear receta</button>
                <Link to="/recipes">
                    Volver a recetas
                </Link>
            </form>

        </div>
    )
}

export default CreateRecipeForm
