import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useRecipe } from "../../hooks/useRecipe"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"

function SingleRecipe() {

    const { recipe_id } = useParams()
    const { getSingleRecipe } = useRecipe()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getSingleRecipe(recipe_id)
    }, [recipe_id])

    if (!store.single_recipe) {
        return <p>Cargando receta...</p>
    }

    return (
        <div>
            <h1>{store.single_recipe.name}</h1>
            <h3>Pasos:</h3>
            <p>{store.single_recipe.steps}</p>

            <Link to="/recipes">
                Volver a recetas
            </Link>
        </div>
    )
}

export default SingleRecipe

