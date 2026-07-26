// Formulario para poder editar las recetas 

import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRecipe } from "../../hooks/useRecipe"
import useGlobalReducer from "../../hooks/useGlobalReducer"

function EditRecipeForm() {

    // Leemos el id de la receta desde la URL
    const { recipeId } = useParams()

    // Usamos el hook de recetas
    const { getSingleRecipe, editRecipe } = useRecipe()

    // Usamos el store global para leer la receta cargada
    const { store } = useGlobalReducer()

    // Estados para editar los campos
    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")

    // Cuando el componente se carga, pedimos la receta al backend
    useEffect(() => {
        getSingleRecipe(recipeId)
    }, [recipeId])

    // Cuando la receta llega al store, rellenamos los inputs
    useEffect(() => {
        if (store.single_recipe) {
            setName(store.single_recipe.name)
            setSteps(store.single_recipe.steps)
        }
    }, [store.single_recipe])

    // Esta función se ejecuta cuando el usuario hace submit
    function handleSubmit(e) {
        e.preventDefault()

        const recipeData = {
            name: name,
            steps: steps
        }

        // Llamamos al hook para editar la receta
        editRecipe(recipeId, recipeData)
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
            </form>
        </div>
    )
}

export default EditRecipeForm
