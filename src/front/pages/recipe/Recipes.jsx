import React, { useEffect } from "react"
import { useRecipe } from "../../hooks/useRecipe"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"

const Recipes = () => {

    // Aquí usamos nuestro hook de recetas
    const { getRecipes, deleteRecipe } = useRecipe()

    // Aquí leemos el store global donde están guardadas las recetas
    const { store } = useGlobalReducer()

    // Cuando el componente se carga, pedimos todas las recetas al backend
    useEffect(() => {
        getRecipes()
    }, [])

    // Aquí convertimos cada receta en un bloque visual
    const recipeList = store.recipes.map((recipe) => {
        return (
            <div key={recipe.id} className="recipe d-flex flex-column gap-2 border p-3">
                <span><strong>Nombre:</strong> {recipe.name}</span>
                <span><strong>Pasos:</strong> {recipe.steps}</span>

                <div className="d-flex gap-3 mt-2">
                    <button 
                        className="btn btn-primary"
                        onClick={() => deleteRecipe(recipe.id)}
                    >
                        Delete recipe
                    </button>

                    <Link to={`/edit_recipe/${recipe.id}`}>
                        <button className="btn btn-primary">Edit recipe</button>
                    </Link>

                    <Link to={`/recipe/${recipe.id}`}>
                        <button className="btn btn-secondary">View recipe</button>
                    </Link>
                </div>
            </div>
        )
    })

    return (
        <div className="recipes_page d-flex flex-column align-items-center gap-3 mt-4">

            {/* Botón para ir al formulario de crear receta */}
            <Link to="/create_recipe">
                <button className="btn btn-primary">Add recipe</button>
            </Link>

            {/* Lista de recetas */}
            <div className="recipes_list d-flex flex-column gap-4 mt-4">
                <h1>Recipes</h1>
                {recipeList}
            </div>
        </div>
    )
}

export default Recipes
