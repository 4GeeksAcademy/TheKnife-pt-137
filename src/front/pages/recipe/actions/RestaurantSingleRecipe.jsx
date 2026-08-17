import { useEffect, useState } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import { useRecipeIngredient } from "../../../hooks/useRecipeIngredient"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import LoadingComponent from "../../../components/LoadingComponent"

const RestaurantSingleRecipe = () => {

    const { store } = useGlobalReducer()
    const { getOneRestaurantRecipe, calculateRecipeCalories } = useRecipe()
    const { fetchRestaurantRecipeIngredients } = useRecipeIngredient()
    const { restaurant_id, recipe_id } = useParams()
    const [loading, setLoading] = useState(true)
    const [caloriesLoading, setCaloriesLoading] = useState(false)
    const [caloriesError, setCaloriesError] = useState(null)
    const isChef = !!localStorage.getItem("cheftoken")

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getOneRestaurantRecipe(restaurant_id, recipe_id),
            fetchRestaurantRecipeIngredients(restaurant_id, recipe_id)
        ]).finally(() => setLoading(false))
    }, [restaurant_id, recipe_id])

    async function handleCalculateCalories() {
        setCaloriesLoading(true)
        setCaloriesError(null)
        try {
            await calculateRecipeCalories(restaurant_id, recipe_id)
        } catch (error) {
            setCaloriesError(error.message)
        } finally {
            setCaloriesLoading(false)
        }
    }

    if (loading) return <LoadingComponent />

    const recipe = store.single_recipe
    const ingredients = store.recipeIngredients || []
    const stepLines = (recipe.steps || "").split("\n").map((line) => line.trim()).filter(Boolean)
    const recipesPath = isChef ? `/restaurants/${restaurant_id}/recipes` : `/restaurants/${restaurant_id}/cook_recipes`

    return (
        <div className="recipe-detail-page">
            <Link to={recipesPath} className="page-back-link">
                <i className="fa-solid fa-arrow-left"></i>Volver a recetas
            </Link>

            <div className="recipe-hero card">
                {recipe.img_url ? (
                    <img src={recipe.img_url} className="recipe-hero-img" alt={recipe.name} />
                ) : (
                    <div className="recipe-hero-img recipe-card-img-placeholder">
                        <i className="fa-solid fa-utensils"></i>
                    </div>
                )}
                <div className="recipe-hero-body">
                    <h1 className="recipe-hero-title">{recipe.name}</h1>
                    <div className="recipe-divider">
                        <span className="recipe-divider-line"></span>
                        <i className="fa-solid fa-utensils recipe-divider-icon"></i>
                        <span className="recipe-divider-line"></span>
                    </div>

                    <div className="recipe-meta">
                        <span><i className="fa-solid fa-basket-shopping"></i>{ingredients.length} ingredientes</span>
                        <span><i className="fa-solid fa-fire"></i>{recipe.calories ? `≈ ${recipe.calories} kcal` : "Sin calorías"}</span>
                    </div>

                    {!recipe.calories && isChef && ingredients.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm recipe-hero-calories-btn"
                            disabled={caloriesLoading}
                            onClick={handleCalculateCalories}
                        >
                            <i className="fa-solid fa-wand-magic-sparkles me-1"></i>
                            {caloriesLoading ? "Calculando..." : "Calcular calorías con IA"}
                        </button>
                    )}
                    {caloriesError && <div className="text-danger small mt-2">{caloriesError}</div>}

                    <div className="recipe-hero-actions">
                        {isChef && (
                            <Link to={`/restaurants/${restaurant_id}/edit_recipe/${recipe_id}`} className="btn btn-outline-success btn-sm">
                                <i className="fa-solid fa-pen me-1"></i>Editar receta
                            </Link>
                        )}
                        <Link to={`/restaurants/${restaurant_id}/recipe/${recipe_id}/ingredients`} className="btn btn-outline-secondary btn-sm">
                            <i className="fa-solid fa-images me-1"></i>Galería de ingredientes
                        </Link>
                    </div>
                </div>
            </div>

            <div className="recipe-detail-grid">
                <div className="card recipe-detail-section">
                    <div className="card-body">
                        <div className="product-section-header">
                            <i className="fa-solid fa-list-ol"></i>
                            <span>PASOS DE PREPARACIÓN</span>
                            <span className="product-section-line"></span>
                        </div>
                        {stepLines.length > 0 ? (
                            <ol className="recipe-steps-list">
                                {stepLines.map((line, index) => (
                                    <li key={index}>{line.replace(/^\d+[.)]\s*/, "")}</li>
                                ))}
                            </ol>
                        ) : (
                            <p className="text-muted mb-0">Esta receta todavía no tiene pasos.</p>
                        )}
                    </div>
                </div>

                <div className="card recipe-detail-section">
                    <div className="card-body">
                        <div className="product-section-header">
                            <i className="fa-solid fa-basket-shopping"></i>
                            <span>INGREDIENTES</span>
                            <span className="product-section-line"></span>
                        </div>
                        {ingredients.length > 0 ? (
                            <div className="recipe-ingredient-list">
                                {ingredients.map((ri) => (
                                    <div className="recipe-ingredient-row" key={ri.id}>
                                        {ri.ingredient_img_url ? (
                                            <img src={ri.ingredient_img_url} className="recipe-ingredient-img" alt={ri.ingredient_name} />
                                        ) : (
                                            <div className="recipe-ingredient-img recipe-ingredient-img-placeholder">
                                                <i className="fa-solid fa-carrot"></i>
                                            </div>
                                        )}
                                        <span className="recipe-ingredient-name">{ri.ingredient_name}</span>
                                        <span className="recipe-ingredient-amount">{ri.amount}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted mb-0">Esta receta todavía no tiene ingredientes.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantSingleRecipe
