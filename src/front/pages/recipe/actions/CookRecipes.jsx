import React, { useEffect, useState } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { Link, useParams } from "react-router-dom"
import LoadingComponent from "../../../components/LoadingComponent"

const CookRecipes = () => {

    const { getAllRestaurantRecipes } = useRecipe()
    const { restaurant_id } = useParams()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantRecipes(restaurant_id).finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const recipeList = store.recipes.map((recipe) => {
        return (
            <div className="col" key={recipe.id}>
                <div className="recipe-card card h-100">
                    <div className="recipe-card-media">
                        {recipe.img_url ? (
                            <img src={recipe.img_url} className="recipe-card-img" alt={recipe.name} />
                        ) : (
                            <div className="recipe-card-img recipe-card-img-placeholder">
                                <i className="fa-solid fa-utensils"></i>
                            </div>
                        )}
                    </div>
                    <div className="card-body d-flex flex-column">
                        <h2 className="recipe-card-title">{recipe.name}</h2>
                        <div className="recipe-divider">
                            <span className="recipe-divider-line"></span>
                            <i className="fa-solid fa-utensils recipe-divider-icon"></i>
                            <span className="recipe-divider-line"></span>
                        </div>
                        <div className="recipe-meta">
                            <span><i className="fa-solid fa-basket-shopping"></i>{recipe.ingredients_count} ingredientes</span>
                            <span><i className="fa-solid fa-fire"></i>{recipe.calories ? `≈ ${recipe.calories} kcal` : "Sin calorías"}</span>
                        </div>
                        <div className="recipe-card-footer">
                            <Link className="recipe-view-link" to={`/restaurants/${restaurant_id}/recipe/${recipe.id}`}>
                                Ver receta <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="recipes_page">
            <div className="cook-page-header">
                <h1 className="cook-page-title">Recetas</h1>
            </div>
            {store.recipes.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {recipeList}
                </div>
            ) : (
                <div className="card">
                    <p className="text-muted text-center py-4 mb-0">Todavía no hay recetas.</p>
                </div>
            )}
        </div>
    )
}

export default CookRecipes
