import React, { useEffect } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { Link, useParams } from "react-router-dom"

const RestaurantRecipes = () => {

    const { getAllRestaurantRecipes, deleteRestaurantRecipe } = useRecipe()
    const { restaurant_id } = useParams()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getAllRestaurantRecipes(restaurant_id)
    }, [])

    const recipeList = store.recipes.map((recipe) => {
        return (
            <div key={recipe.id} className="recipe d-flex flex-column gap-2 border p-3">
                <span><strong>Nombre:</strong> {recipe.name}</span>
                <span><strong>Pasos:</strong> {recipe.steps}</span>
                <span><strong>Restaurant:</strong> {recipe.restaurant_name}</span>

                <div className="d-flex gap-3 mt-2">
                    <button 
                        className="btn btn-danger"
                        onClick={() => deleteRestaurantRecipe(restaurant_id, recipe.id)}
                    >
                        Delete recipe
                    </button>

                    <Link to={`/edit_recipe/${recipe.id}`}>
                        <button className="btn btn-warning">Edit recipe</button>
                    </Link>

                    <Link to={`/recipe/${recipe.id}`}>
                        <button className="btn btn-secondary">View recipe</button>
                    </Link>
                    <img src={recipe.img_url} height="150" width="200" />
                </div>
            </div>
        )
    })

    return (
        <div className="recipes_page d-flex flex-column align-items-center gap-3 mt-4">

            {/* Botón para ir al formulario de crear receta */}
            <Link to={`/restaurants/${restaurant_id}/create_recipe`}>
                <button className="btn btn-primary">Add recipe</button>
            </Link>

            {/* Lista de recetas */}
            <div className="recipes_list d-flex flex-column gap-4 mt-4">
                <h1>Recipes</h1>
                {recipeList}
                <Link to="/chef_dashboard">Back to Dashboard</Link>
            </div>
        </div>
    )
}

export default RestaurantRecipes
