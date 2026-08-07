import React, { useEffect } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { Link, useParams } from "react-router-dom"

const CookRecipes = () => {

    const { getAllRestaurantRecipes } = useRecipe()
    const { restaurant_id } = useParams()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getAllRestaurantRecipes(restaurant_id)
    }, [])

    const recipeList = store.recipes.map((recipe) => {
        return (
            <div key={recipe.id} className="col-md-4">
                <div className="card h-100">
                    <img src={recipe.img_url} className="card-img-top" height="180" style={{ objectFit: "cover" }} />
                    <div className="card-body d-flex flex-column">
                        <h2 className="h5">{recipe.name}</h2>
                        <p className="card-text flex-grow-1">{recipe.steps}</p>
                        <Link to={`/restaurants/${restaurant_id}/recipe/${recipe.id}`}><button className="btn btn-secondary btn-sm">View recipe</button></Link>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="recipes_page container py-4">
            <h1 className="h4 mb-3">Recipes</h1>
            <div className="recipes row g-3">
                {recipeList}
            </div>
            <Link to="/cook_dashboard" className="d-inline-block mt-3">Back to dashboard</Link>
        </div>
    )
}

export default CookRecipes
