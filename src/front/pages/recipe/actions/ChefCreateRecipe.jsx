//crear una nueva receta nueva

import React, { useState, useEffect } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import { useIngredient } from "../../../hooks/useIngredient"
import { Link, useParams } from "react-router-dom"
import { useCloudinary } from "../../../hooks/useCloudinary"
import useGlobalReducer from "../../../hooks/useGlobalReducer"


function ChefCreateRecipe() {

    const { chefCreateRecipeWithIngredients, generateRecipeFromImage } = useRecipe()
    const { fetchActiveIngredients, fetchInactiveIngredients } = useIngredient()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()

    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")
    const [img_url, setImg_url] = useState("")
    const { uploadImage } = useCloudinary()

    // Sugerencia generada por IA a partir de la foto (no se guarda hasta enviar el formulario)
    const [aiIngredients, setAiIngredients] = useState([])
    const [aiLoading, setAiLoading] = useState(false)
    const [aiError, setAiError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Ingredientes añadidos a mano por el chef (tampoco se guardan hasta enviar el formulario)
    const [manualIngredients, setManualIngredients] = useState([])
    const [ingredientQuery, setIngredientQuery] = useState("")
    const [ingredientId, setIngredientId] = useState("")
    const [amount, setAmount] = useState("")

    const allIngredients = [...(store.ingredients || []), ...(store.inactiveIngredients || [])]
    const matchingIngredients = ingredientQuery
        ? allIngredients.filter((ing) => ing.name.toLowerCase().includes(ingredientQuery.toLowerCase()))
        : []

    useEffect(() => {
        fetchActiveIngredients()
        fetchInactiveIngredients()
    }, [])

    function handleSelectIngredient(ing) {
        setIngredientId(ing.id)
        setIngredientQuery(ing.name)
    }

    function handleQueryChange(e) {
        setIngredientQuery(e.target.value)
        setIngredientId("")
    }

    function handleAddIngredient() {
        if (!ingredientId || !amount) return
        setManualIngredients([...manualIngredients, { name: ingredientQuery, amount }])
        setIngredientId("")
        setIngredientQuery("")
        setAmount("")
    }

    function handleRemoveManualIngredient(index) {
        setManualIngredients(manualIngredients.filter((_, i) => i !== index))
    }

    function handleEditAiIngredientAmount(index, newAmount) {
        setAiIngredients(aiIngredients.map((ing, i) => i === index ? { ...ing, amount: newAmount } : ing))
    }

    function handleRemoveAiIngredient(index) {
        setAiIngredients(aiIngredients.filter((_, i) => i !== index))
    }

    async function handleGenerateWithAI() {
        if (!img_url.img_url) return
        setAiLoading(true)
        setAiError(null)
        try {
            const suggestion = await generateRecipeFromImage(restaurant_id, img_url.img_url)
            setName(suggestion.name)
            setSteps(suggestion.steps)
            setAiIngredients(suggestion.ingredients)
        } catch (error) {
            setAiError(error.message)
        } finally {
            setAiLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        const recipeData = {
            name: name,
            steps: steps,
            img_url: img_url.img_url,
        }
        try {
            await chefCreateRecipeWithIngredients(restaurant_id, recipeData, [...aiIngredients, ...manualIngredients])
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Crear receta</div>
                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setImg_url, img_url)} />
                        </div>

                        <div className="mb-3">
                            <button
                                type="button"
                                className="btn btn-outline-primary w-100"
                                disabled={!img_url.img_url || aiLoading}
                                onClick={handleGenerateWithAI}
                            >
                                {aiLoading ? "Generando receta..." : "Generar receta con IA"}
                            </button>
                            {!img_url.img_url && (
                                <div className="form-text">Sube antes una foto del plato para poder generar la receta.</div>
                            )}
                            {aiError && <div className="text-danger mt-2">{aiError}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">Nombre de la receta</label>
                            <input
                                className="form-control"
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="steps">Pasos</label>
                            <textarea
                                className="form-control"
                                style={{height: "150px"}}
                                id="steps"
                                value={steps}
                                onChange={(e) => setSteps(e.target.value)}
                            />
                        </div>

                        {aiIngredients.length > 0 && (
                            <div className="mb-3">
                                <label className="form-label">Ingredientes sugeridos por la IA</label>
                                <ul className="list-group">
                                    {aiIngredients.map((ing, index) => (
                                        <li className="list-group-item d-flex justify-content-between align-items-center gap-2" key={index}>
                                            <span>{ing.name}</span>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control form-control-sm"
                                                    style={{ width: "80px" }}
                                                    value={ing.amount}
                                                    onChange={(e) => handleEditAiIngredientAmount(index, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveAiIngredient(index)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="form-text">Se añadirán a la receta al guardarla.</div>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label">Ingredientes</label>

                            {manualIngredients.length > 0 && (
                                <ul className="list-group mb-2">
                                    {manualIngredients.map((ing, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{ing.name} — cantidad: {ing.amount}</span>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveManualIngredient(index)}
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="mb-2 position-relative">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escribe el nombre del ingrediente..."
                                    value={ingredientQuery}
                                    onChange={handleQueryChange}
                                    autoComplete="off"
                                />
                                {ingredientQuery && !ingredientId && (
                                    matchingIngredients.length > 0 ? (
                                        <ul className="list-group position-absolute w-100" style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto" }}>
                                            {matchingIngredients.map((ing) => (
                                                <li
                                                    key={ing.id}
                                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleSelectIngredient(ing)}
                                                >
                                                    {ing.name}
                                                    <span className={`badge ${ing.active ? "bg-success" : "bg-secondary"}`}>
                                                        {ing.active ? "Activo" : "Inactivo"}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="form-text text-muted">No se encontró ningún ingrediente con ese nombre.</div>
                                    )
                                )}
                            </div>

                            <div className="d-flex gap-2 mb-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Cantidad"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    disabled={!ingredientId || !amount}
                                    onClick={handleAddIngredient}
                                >
                                    Añadir ingrediente
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={submitting}>
                            {submitting ? "Creating..." : "Create recipe"}
                        </button>

                        <div className="text-center">
                            <Link to={`/restaurants/${restaurant_id}/recipes`}>
                                Volver a recetas
                            </Link>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    )
}

export default ChefCreateRecipe
