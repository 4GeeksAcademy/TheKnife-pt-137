import React, { useEffect, useState } from "react";
import { useRecipe } from "../../../hooks/useRecipe";
import { useRecipeIngredient } from "../../../hooks/useRecipeIngredient";
import { useIngredient } from "../../../hooks/useIngredient";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useCloudinary } from "../../../hooks/useCloudinary";

const ChefEditRecipe = () => {

    const { store } = useGlobalReducer()
    const [recipeData, setRecipeData] = useState({ name: "", steps: "", img_url: "" })
    const { getOneRestaurantRecipe, chefEditRecipe } = useRecipe()
    const {
        fetchRestaurantRecipeIngredients,
        chefAddRecipeIngredient,
        chefUpdateRecipeIngredient,
        chefRemoveRecipeIngredient
    } = useRecipeIngredient()
    const { fetchActiveIngredients, fetchInactiveIngredients } = useIngredient()
    const { restaurant_id, recipe_id } = useParams()
    const { uploadImage } = useCloudinary()

    const [ingredientId, setIngredientId] = useState("")
    const [amount, setAmount] = useState("")

    useEffect(() => {
        getOneRestaurantRecipe(restaurant_id, recipe_id)
        fetchRestaurantRecipeIngredients(restaurant_id, recipe_id)
        fetchActiveIngredients()
        fetchInactiveIngredients()
    }, [])

    useEffect(() => {
        if (store.single_recipe.id) {
            setRecipeData({
                name: store.single_recipe.name,
                steps: store.single_recipe.steps,
                img_url: store.single_recipe.img_url
            })
        }
    }, [store.single_recipe])

    function handleAddIngredient(e) {
        e.preventDefault()
        chefAddRecipeIngredient(restaurant_id, recipe_id, { ingredient_id: ingredientId, amount: amount })
        setIngredientId("")
        setAmount("")
    }

    function handleEditAmount(e, recipeIngredient) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const newAmount = formData.get("amount")
        chefUpdateRecipeIngredient(restaurant_id, recipe_id, recipeIngredient.id, {
            ingredient_id: recipeIngredient.ingredient_id,
            amount: newAmount
        })
    }

    return (
        <div className="container py-5" style={{ maxWidth: "600px" }}>

            <div className="card mb-4">
                <div className="card-header text-center">Edit recipe</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setRecipeData({ ...recipeData, name: e.target.value })} value={recipeData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="steps">Steps</label>
                        <textarea className="form-control" onChange={(e) => setRecipeData({ ...recipeData, steps: e.target.value })} value={recipeData.steps} name="steps" id="steps" />
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setRecipeData, recipeData)} />
                    </div>

                    <button onClick={() => chefEditRecipe(restaurant_id, recipe_id, recipeData)} className="btn btn-primary w-100 mb-3">Edit recipe</button>

                    <div className="text-center">
                        <Link to={`/restaurants/${restaurant_id}/recipes`}>
                            Volver a recetas
                        </Link>
                    </div>

                </div>
            </div>

            <div className="card">
                <div className="card-header">Ingredients</div>
                <div className="card-body">

                    {store.recipeIngredients && store.recipeIngredients.length > 0 ? (
                        <ul className="list-group list-group-flush mb-3">
                            {store.recipeIngredients.map((ri) => (
                                <li key={ri.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <span>{ri.ingredient_name} — cantidad: {ri.amount}</span>

                                    <div className="d-flex gap-2 align-items-center">
                                        <form
                                            onSubmit={(e) => handleEditAmount(e, ri)}
                                            className="d-flex gap-2 align-items-center"
                                        >
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="amount"
                                                defaultValue={ri.amount}
                                                className="form-control form-control-sm"
                                                style={{ width: "80px" }}
                                            />
                                            <button type="submit" className="btn btn-outline-primary btn-sm">Guardar</button>
                                        </form>

                                        <button onClick={() => chefRemoveRecipeIngredient(restaurant_id, recipe_id, ri.id)} className="btn btn-danger btn-sm">
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">Esta receta todavía no tiene ingredientes.</p>
                    )}

                    <form onSubmit={handleAddIngredient}>
                        <div className="mb-2">
                            <label className="form-label">Ingrediente</label>
                            <select
                                className="form-select"
                                value={ingredientId}
                                onChange={(e) => setIngredientId(e.target.value)}
                                required
                            >
                                <option value="">-- Selecciona un ingrediente --</option>
                                {store.ingredients && store.ingredients.map((ing) => (
                                    <option key={ing.id} value={ing.id}>
                                        {ing.name}
                                    </option>
                                ))}
                                {store.inactiveIngredients && store.inactiveIngredients.map((ing) => (
                                    <option key={ing.id} value={ing.id}>
                                        {ing.name} (inactivo)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Cantidad</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Añadir ingrediente</button>
                    </form>

                </div>
            </div>

        </div>
    )
}

export default ChefEditRecipe;
