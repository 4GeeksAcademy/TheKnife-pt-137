// Vista individual de  cada receta

import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRecipe } from "../../hooks/useRecipe"
import useGlobalReducer from "../../hooks/useGlobalReducer"

function SingleRecipe() {

    // useParams sirve para leer el id que viene en la URL
    // Por ejemplo, si la URL es /recipes/5, entonces recipeId será "5"
    const { recipeId } = useParams()

    // Aquí usamos nuestro hook de recetas
    const { getSingleRecipe } = useRecipe()

    // Aquí obtenemos el store global para leer la receta guardada
    const { store } = useGlobalReducer()

    // Cuando el componente se carga, pedimos la receta al backend
    useEffect(() => {
        // Llamamos a la función que trae la receta por id
        getSingleRecipe(recipeId)
    }, [recipeId])


    // Si todavía no hay receta en el store, mostramos un mensaje
    if (!store.single_recipe) {
        return <p>Cargando receta...</p>
    }

    // Si ya tenemos la receta, la mostramos
    return (
        <div>
            <h1>{store.single_recipe.name}</h1>

            <h3>Pasos:</h3>
            <p>{store.single_recipe.steps}</p>
        </div>
    )
}

export default SingleRecipe
