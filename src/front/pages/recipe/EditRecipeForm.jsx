import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRecipe } from "../../hooks/useRecipe"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"

function EditRecipeForm() {

    const { recipe_id } = useParams()
    const { getSingleRecipe, editRecipe } = useRecipe()
    const { store } = useGlobalReducer()

    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")
    const [img_url, setImg_url] = useState("")

    useEffect(() => {
        getSingleRecipe(recipe_id)
    }, [recipe_id])

    useEffect(() => {
        if (store.single_recipe) {
            setName(store.single_recipe.name)
            setSteps(store.single_recipe.steps)
            setImg_url(store.single_recipe.img_url)
        }
    }, [store.single_recipe])

    function handleSubmit(e) {
        e.preventDefault()

        const recipeData = {
            name: name,
            steps: steps,
            img_url: img_url
        }

        editRecipe(recipe_id, recipeData)
    }

    if (!store.single_recipe) {
        return <p>Cargando receta...</p>
    }

    return (
        <div>
            <h1>Editar receta</h1>

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

                <button type="submit">Guardar cambios</button>
                <Link to="/recipes">
                    Volver a recetas
                </Link>
            </form>
        </div>
    )
}

export default EditRecipeForm
