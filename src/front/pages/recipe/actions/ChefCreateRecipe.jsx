//crear una nueva receta nueva 

import React, { useState, useEffect } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import { Link, useParams } from "react-router-dom"
import { useCloudinary } from "../../../hooks/useCloudinary"
import useGlobalReducer from "../../../hooks/useGlobalReducer"


function ChefCreateRecipe() {

    const { chefCreateRecipe } = useRecipe()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()

    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")
    const [img_url, setImg_url] = useState("")
    const { uploadImage } = useCloudinary()

    function handleSubmit(e) {
        e.preventDefault()
        const recipeData = {
            name: name,
            steps: steps,
            img_url: img_url.img_url,
        }
        chefCreateRecipe(restaurant_id, recipeData)
    }


    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Crear receta</div>
                <div className="card-body">

                    <form onSubmit={handleSubmit}>

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

                        <div className="mb-3">
                            <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setImg_url, img_url)} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mb-3">Create recipe</button>

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
