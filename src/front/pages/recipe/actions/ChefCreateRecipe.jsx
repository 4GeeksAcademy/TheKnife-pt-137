//crear una nueva receta nueva 

import React, { useState, useEffect } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import { Link, useParams } from "react-router-dom"
import { useCloudinary } from "../../../hooks/useCloudinary"
import useGlobalReducer from "../../../hooks/useGlobalReducer"


function ChefCreateRecipe() {

    const { chefCreateRecipe } = useRecipe()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()

    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")
    const [img_url, setImg_url] = useState("")
    const { uploadImage } = useCloudinary()

    function handleSubmit(e) {
        e.preventDefault()
        const recipeData = {
            name: name,
            steps: steps,
            img_url: img_url.img_url,
        }
        chefCreateRecipe(restaurant_id, recipeData)
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

                <input type="file" onChange={(e) => uploadImage(e, "cocinapp_images", setImg_url, img_url)} />
                <button type="submit">Create recipe</button>
                <Link to="/recipes">
                    Volver a recetas
                </Link>
            </form>

        </div>
    )
}

export default ChefCreateRecipe
