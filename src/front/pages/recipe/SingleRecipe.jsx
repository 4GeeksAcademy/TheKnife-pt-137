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
        return <p>Cargando receta...</p>
    }

    return (
        <div>
            <h1>{store.single_recipe.name}</h1>
            <h3>Pasos:</h3>
            <p>{store.single_recipe.steps}</p>

            <h3>Ingredientes:</h3>
            {store.recipeIngredients && store.recipeIngredients.length > 0 ? (
                <ul>
                    {store.recipeIngredients.map((ri) => {
                        const ingredientInfo = store.ingredients?.find(
                            (ing) => ing.id === ri.ingredient_id
                        )
                        return (
                            <li key={ri.id}>
                                {ingredientInfo ? ingredientInfo.name : `Ingrediente #${ri.ingredient_id}`} — cantidad: {ri.amount}

                                <form
                                    onSubmit={(event) => handleEditAmount(event, ri)}
                                    style={{ display: "inline", marginLeft: "10px" }}
                                >
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="amount"
                                        defaultValue={ri.amount}
                                    />
                                    <button type="submit">Guardar cantidad</button>
                                </form>

                                <button onClick={() => handleRemoveIngredient(ri.id)}>
                                    Eliminar
                                </button>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <p>Esta receta todavía no tiene ingredientes.</p>
            )}

            <h4>Añadir ingrediente a esta receta</h4>
            <form onSubmit={handleAddIngredient}>
                <label>
                    Ingrediente:
                    <select
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
                </label>
                <br />
                <label>
                    Cantidad:
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Añadir</button>
            </form>

            <br />

            <button onClick={handleDeleteRecipe}>
                Eliminar esta receta
            </button>

            <br /><br />

            <Link to="/recipes">
                Volver a recetas
            </Link>
        </div>
    )
}

export default SingleRecipe