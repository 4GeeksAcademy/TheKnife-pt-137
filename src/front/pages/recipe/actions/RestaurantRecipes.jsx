import React, { useEffect, useState } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { Link, useParams } from "react-router-dom"

const RestaurantRecipes = () => {

    const { getAllRestaurantRecipes, deleteRestaurantRecipe } = useRecipe()
    const { restaurant_id } = useParams()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantRecipes(restaurant_id).finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center">Loading...</p>

    const recipeList = store.recipes.map((recipe) => {
        return (
            <div key={recipe.id} className="col-md-4">
                <div className="card h-100">
                    <img src={recipe.img_url} className="card-img-top" height="180" style={{ objectFit: "cover" }} />
                    <div className="card-body d-flex flex-column">
                        <h2 className="h5">{recipe.name}</h2>
                        <p className="card-text flex-grow-1">{recipe.steps}</p>
                        <div className="d-flex gap-2 mt-2">
                            <button className="btn btn-danger btn-sm" onClick={() => deleteRestaurantRecipe(restaurant_id, recipe.id)}>Delete</button>
                            <Link to={`/restaurants/${restaurant_id}/edit_recipe/${recipe.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                            <Link to={`/restaurants/${restaurant_id}/recipe/${recipe.id}`}><button className="btn btn-secondary btn-sm">View</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="recipes_page container py-4">
            <Link to={`/restaurants/${restaurant_id}/create_recipe`}><button className="btn btn-primary mb-4">Add recipe</button></Link>
            <h1 className="h4 mb-3">Recipes</h1>
            <div className="recipes row g-3">
                {recipeList}
            </div>
            <Link to="/chef_dashboard" className="d-inline-block mt-3">Back to dashboard</Link>
        </div>
    )
}

export default RestaurantRecipes
