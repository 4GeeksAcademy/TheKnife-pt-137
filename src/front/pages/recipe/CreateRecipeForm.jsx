//crear una nueva receta nueva 

import React, { useState } from "react"
import { useRecipe } from "../../hooks/useRecipe"

function CreateRecipeForm() {

    // Aquí usamos nuestro hook de recetas
    const { createRecipe } = useRecipe()

    // Estados para guardar lo que escribe el usuario
    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")

    // Esta función se ejecuta cuando el usuario hace submit
    function handleSubmit(e) {
        e.preventDefault()

        // Creamos un objeto con los datos de la receta
        const recipeData = {
            name: name,
            steps: steps
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

                <button type="submit">Crear receta</button>
            </form>
        </div>
    )
}

export default CreateRecipeForm
