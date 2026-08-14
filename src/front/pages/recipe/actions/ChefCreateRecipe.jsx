//crear una nueva receta nueva

import React, { useState, useEffect } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import { Link, useParams } from "react-router-dom"
import { useCloudinary } from "../../../hooks/useCloudinary"
import useGlobalReducer from "../../../hooks/useGlobalReducer"


function ChefCreateRecipe() {

    const { chefCreateRecipeWithIngredients, generateRecipeFromImage } = useRecipe()
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
            await chefCreateRecipeWithIngredients(restaurant_id, recipeData, aiIngredients)
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
                                        <li className="list-group-item d-flex justify-content-between" key={index}>
                                            <span>{ing.name}</span>
                                            <span className="text-muted">{ing.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="form-text">Se añadirán a la receta al guardarla.</div>
                            </div>
                        )}

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
