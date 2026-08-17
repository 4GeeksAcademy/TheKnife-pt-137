import React, { useEffect, useState } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { Link, useParams } from "react-router-dom"
import LoadingComponent from "../../../components/LoadingComponent"

const RecipeActionsMenu = ({ menuId, restaurant_id, recipe, onDelete }) => (
    <ul className="dropdown-menu dropdown-menu-end recipe-menu" aria-labelledby={menuId}>
        <li>
            <Link className="dropdown-item" to={`/restaurants/${restaurant_id}/edit_recipe/${recipe.id}`}>
                <i className="fa-solid fa-pen me-2"></i>Editar receta
            </Link>
        </li>
        <li>
            <Link className="dropdown-item" to={`/restaurants/${restaurant_id}/recipe/${recipe.id}`}>
                <i className="fa-solid fa-eye me-2"></i>Ver información
            </Link>
        </li>
        <li>
            <button type="button" className="dropdown-item text-danger" onClick={onDelete}>
                <i className="fa-solid fa-trash-can me-2"></i>Eliminar receta
            </button>
        </li>
    </ul>
)

const RestaurantRecipes = () => {

    const { getAllRestaurantRecipes, deleteRestaurantRecipe } = useRecipe()
    const { restaurant_id } = useParams()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantRecipes(restaurant_id).finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const recipeList = store.recipes.map((recipe) => {
        const topMenuId = `recipe-menu-top-${recipe.id}`
        const bottomMenuId = `recipe-menu-bottom-${recipe.id}`
        const handleDelete = () => deleteRestaurantRecipe(restaurant_id, recipe.id)

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
                            <div className="dropdown">
                                <button id={bottomMenuId} type="button" className="recipe-menu-btn recipe-menu-btn-inline" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa-solid fa-ellipsis"></i>
                                </button>
                                <RecipeActionsMenu menuId={bottomMenuId} restaurant_id={restaurant_id} recipe={recipe} onDelete={handleDelete} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="recipes_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Recetas</h1>
                <Link to={`/restaurants/${restaurant_id}/create_recipe`} className="btn btn-primary">Añadir receta</Link>
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

export default RestaurantRecipes
