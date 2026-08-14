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

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <img src={store.single_recipe.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                <div className="card-body">
                    <h1 className="h4">{store.single_recipe.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Steps:</strong> {store.single_recipe.steps}</li>
                    </ul>

                    <h2 className="h6">Ingredients</h2>
                    {store.recipeIngredients && store.recipeIngredients.length > 0 ? (
                        <ul className="list-group list-group-flush mb-3">
                            {store.recipeIngredients.map((ri) => (
                                <li key={ri.id} className="list-group-item">
                                    {ri.ingredient_name} — {ri.amount}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">Esta receta todavía no tiene ingredientes.</p>
                    )}

                    <div className="mb-3">
                        {store.single_recipe.calories ? (
                            <p><strong>Calorías estimadas:</strong> {store.single_recipe.calories} kcal</p>
                        ) : (
                            isChef && store.recipeIngredients && store.recipeIngredients.length > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={caloriesLoading}
                                    onClick={handleCalculateCalories}
                                >
                                    {caloriesLoading ? "Calculando..." : "Calcular calorías con IA"}
                                </button>
                            )
                        )}
                        {caloriesError && <div className="text-danger mt-2">{caloriesError}</div>}
                    </div>

                    <div className="d-flex gap-2">
                        {isChef && <Link to={`/restaurants/${restaurant_id}/edit_recipe/${recipe_id}`} className="btn btn-warning">Edit recipe</Link>}
                        <Link to={`/restaurants/${restaurant_id}/recipe/${recipe_id}/ingredients`} className="btn btn-info">View ingredients</Link>
                        <Link to={isChef ? `/restaurants/${restaurant_id}/recipes` : `/restaurants/${restaurant_id}/cook_recipes`} className="btn btn-outline-secondary">Back to recipes</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RestaurantSingleRecipe;
