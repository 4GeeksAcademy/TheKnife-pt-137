import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRecipe } from "../../hooks/useRecipe"
import { useCloudinary } from "../../hooks/useCloudinary"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"

function EditRecipeForm() {

    const { recipe_id } = useParams()
    const { getSingleRecipe, editRecipe } = useRecipe()
    const { store } = useGlobalReducer()

    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")
    const [img_url, setImg_url] = useState("")
    const { uploadImage } = useCloudinary()

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
            img_url: img_url.img_url
        }

        editRecipe(recipe_id, recipeData)
    }

    if (!store.single_recipe) {
        return <p className="text-center mt-5">Cargando receta...</p>
    }

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Editar receta</div>
                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">Nombre de la receta</label>
                            <input
                                className="form-control"
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="steps">Pasos</label>
                            <textarea
                                className="form-control"
                                id="steps"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <input type="file" className="form-control" onChange={(e)=>uploadImage(e, "cocinapp_images",setImg_url, img_url)} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mb-3">Guardar cambios</button>

                        <div className="text-center">
                            <Link to="/recipes">Volver a recetas</Link>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    )
}

export default EditRecipeForm
