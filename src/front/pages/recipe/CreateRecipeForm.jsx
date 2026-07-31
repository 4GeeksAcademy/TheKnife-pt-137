//crear una nueva receta nueva 

import React, { useState } from "react"
import { useRecipe } from "../../hooks/useRecipe"
import { Link } from "react-router-dom"

function CreateRecipeForm() {

    // Aquí usamos nuestro hook de recetas
    const { createRecipe } = useRecipe()

    // Estados para guardar lo que escribe el usuario
    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")
    const [img_url, setImg_url] = useState("")

    // Esta función se ejecuta cuando el usuario hace submit
    function handleSubmit(e) {
        e.preventDefault()
        // Creamos un objeto con los datos de la receta
        const recipeData = {
            name: name,
            steps: steps,
            img_url: img_url
        }
        // Llamamos al hook para crear la receta
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

                <input
                    type="file"
                    onChange={async (e) => {
                        const image = e.target.files[0]
                        const formData = new FormData()
                        formData.append("file", image)
                        formData.append("upload_preset", "cocinapp_images")
                        const response = await fetch(
                            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                            {
                                method: "POST",
                                body: formData
                            }
                        )
                        const data = await response.json()
                        setImg_url(data.secure_url)
                    }}
                />
                <button type="submit">Crear receta</button>
                <Link to="/recipes">
                    Volver a recetas
                </Link>
            </form>

        </div>
    )
}

export default CreateRecipeForm
