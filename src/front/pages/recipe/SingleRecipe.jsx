import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useRecipe } from "../../hooks/useRecipe"
import { useRecipeIngredient } from "../../hooks/useRecipeIngredient"
import { useIngredient } from "../../hooks/useIngredient"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"

function SingleRecipe() {

    const { recipe_id } = useParams()
    const navigate = useNavigate()
    const { getSingleRecipe, deleteRecipe } = useRecipe()
    const {
        fetchRecipeIngredientsByRecipe,
        addRecipeIngredient,
        updateRecipeIngredient,
        removeRecipeIngredient
    } = useRecipeIngredient()
    const { fetchIngredients } = useIngredient()
    const { store } = useGlobalReducer()

    // Campos del formulario para añadir un ingrediente a la receta
    const [ingredientId, setIngredientId] = useState("")
    const [amount, setAmount] = useState("")

    useEffect(() => {
        getSingleRecipe(recipe_id)
        fetchRecipeIngredientsByRecipe(recipe_id)
        fetchIngredients() // traemos todos los ingredientes para poder elegirlos por nombre
    }, [recipe_id])

    const handleAddIngredient = async (event) => {
        event.preventDefault()

        await addRecipeIngredient({
            recipe_id: recipe_id,
            ingredient_id: ingredientId,
            amount: amount
        })

        // Volvemos a pedir la lista para que se vea el nuevo ingrediente
        fetchRecipeIngredientsByRecipe(recipe_id)

        // Limpiamos el formulario
        setIngredientId("")
        setAmount("")
    }

    // Elimina un ingrediente concreto de la receta (sin useState, botón directo)
    const handleRemoveIngredient = async (recipeIngredientId) => {
        await removeRecipeIngredient(recipeIngredientId, recipe_id)
    }

    // Edita la cantidad de un ingrediente de la receta (formulario no controlado)
    const handleEditAmount = async (event, ri) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const newAmount = formData.get("amount")

        await updateRecipeIngredient(ri.id, {
            recipe_id: recipe_id,
            ingredient_id: ri.ingredient_id,
            amount: newAmount
        })

        fetchRecipeIngredientsByRecipe(recipe_id)
    }

    // Elimina la receta completa
    const handleDeleteRecipe = async () => {
        await deleteRecipe(recipe_id)
        navigate("/recipes")
    }

    if (!store.single_recipe) {
        return <p className="text-center mt-5">Cargando receta...</p>
    }

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "600px" }}>
                <img src={store.single_recipe.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                <div className="card-body">
                    <h1 className="h4">{store.single_recipe.name}</h1>
                    <p><strong>Pasos:</strong> {store.single_recipe.steps}</p>

                    <h2 className="h6 mt-3">Ingredientes</h2>
                    {store.recipeIngredients && store.recipeIngredients.length > 0 ? (
                        <ul className="list-group list-group-flush mb-3">
                            {store.recipeIngredients.map((ri) => {
                                const ingredientInfo = store.ingredients?.find(
                                    (ing) => ing.id === ri.ingredient_id
                                )
                                return (
                                    <li key={ri.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2">
                                        <span>{ingredientInfo ? ingredientInfo.name : `Ingrediente #${ri.ingredient_id}`} — cantidad: {ri.amount}</span>

                                        <div className="d-flex gap-2 align-items-center">
                                            <form
                                                onSubmit={(event) => handleEditAmount(event, ri)}
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

                                            <button onClick={() => handleRemoveIngredient(ri.id)} className="btn btn-danger btn-sm">
                                                Eliminar
                                            </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p className="text-muted">Esta receta todavía no tiene ingredientes.</p>
                    )}

                    <h2 className="h6 mt-3">Añadir ingrediente a esta receta</h2>
                    <form onSubmit={handleAddIngredient} className="mb-3">
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
                        <button type="submit" className="btn btn-primary w-100">Añadir</button>
                    </form>

                    <div className="d-flex gap-2">
                        <button onClick={handleDeleteRecipe} className="btn btn-danger btn-sm">
                            Eliminar esta receta
                        </button>
                        <Link to="/recipes" className="btn btn-outline-secondary btn-sm">
                            Volver a recetas
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SingleRecipe