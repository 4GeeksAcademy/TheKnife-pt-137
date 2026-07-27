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

    useEffect(() => {
        getSingleRecipe(recipe_id)
    }, [recipe_id])

    useEffect(() => {
        if (store.single_recipe) {
            setName(store.single_recipe.name)
            setSteps(store.single_recipe.steps)
        }
    }, [store.single_recipe])

    function handleSubmit(e) {
        e.preventDefault()

        const recipeData = {
            name: name,
            steps: steps
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

                <button type="submit">Guardar cambios</button>
                <Link to="/recipes">
                    Volver a recetas
                </Link>
            </form>
        </div>
    )
}

export default EditRecipeForm
