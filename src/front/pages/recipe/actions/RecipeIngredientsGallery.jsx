import { useEffect, useState } from "react"
import { useRecipeIngredient } from "../../../hooks/useRecipeIngredient"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import LoadingComponent from "../../../components/LoadingComponent"

const RecipeIngredientsGallery = () => {

    const { store } = useGlobalReducer()
    const { fetchRestaurantRecipeIngredients } = useRecipeIngredient()
    const { restaurant_id, recipe_id } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchRestaurantRecipeIngredients(restaurant_id, recipe_id).finally(() => setLoading(false))
    }, [restaurant_id, recipe_id])

    if (loading) return <LoadingComponent />

    const ingredients = store.recipeIngredients || []

    return (
        <div className="recipe-detail-page">
            <Link to={`/restaurants/${restaurant_id}/recipe/${recipe_id}`} className="page-back-link">
                <i className="fa-solid fa-arrow-left"></i>Volver a la receta
            </Link>

            <div className="chef-page-header">
                <h1 className="chef-page-title">Galería de ingredientes</h1>
            </div>

            {ingredients.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {ingredients.map((ri) => (
                        <div className="col" key={ri.id}>
                            <div className="recipe-card card h-100">
                                <div className="recipe-card-media">
                                    {ri.ingredient_img_url ? (
                                        <img src={ri.ingredient_img_url} className="recipe-card-img" alt={ri.ingredient_name} />
                                    ) : (
                                        <div className="recipe-card-img recipe-card-img-placeholder">
                                            <i className="fa-solid fa-carrot"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="card-body d-flex align-items-center justify-content-between gap-2">
                                    <h2 className="recipe-card-title mb-0">{ri.ingredient_name}</h2>
                                    <span className="recipe-ingredient-amount">{ri.amount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <p className="text-muted text-center py-4 mb-0">Esta receta todavía no tiene ingredientes.</p>
                </div>
            )}
        </div>
    )
}

export default RecipeIngredientsGallery
