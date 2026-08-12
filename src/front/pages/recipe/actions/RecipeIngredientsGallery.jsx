import { useEffect } from "react"
import { useRecipeIngredient } from "../../../hooks/useRecipeIngredient"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const RecipeIngredientsGallery = () => {

    const { store } = useGlobalReducer()
    const { fetchRestaurantRecipeIngredients } = useRecipeIngredient()
    const { restaurant_id, recipe_id } = useParams()

    useEffect(() => {
        fetchRestaurantRecipeIngredients(restaurant_id, recipe_id)
    }, [restaurant_id, recipe_id])

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Ingredients</h1>

            {store.recipeIngredients && store.recipeIngredients.length > 0 ? (
                <div className="row g-3">
                    {store.recipeIngredients.map((ri) => (
                        <div key={ri.id} className="col-md-4">
                            <div className="card h-100">
                                <img src={ri.ingredient_img_url} className="card-img-top" height="180" style={{ objectFit: "cover" }} />
                                <div className="card-body">
                                    <h2 className="h5 mb-0">{ri.ingredient_name}</h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted">Esta receta todavía no tiene ingredientes.</p>
            )}

            <Link to={`/restaurants/${restaurant_id}/recipe/${recipe_id}`} className="btn btn-outline-secondary mt-4">Back</Link>
        </div>
    )
}

export default RecipeIngredientsGallery;
