//crear una nueva receta nueva 

import React, { useState, useEffect } from "react"
import { useRecipe } from "../../hooks/useRecipe"
import { Link } from "react-router-dom"
import { useCloudinary } from "../../hooks/useCloudinary"
import { useRestaurant } from "../../hooks/useRestaurant"
import useGlobalReducer from "../../hooks/useGlobalReducer"


function CreateRecipeForm() {

    const { createRecipe } = useRecipe()
    const { getRestaurants } = useRestaurant()
    const { store } = useGlobalReducer()

    const [name, setName] = useState("")
    const [steps, setSteps] = useState("")
    const [img_url, setImg_url] = useState("")
    const [restaurant_id, setRestaurant_id] = useState("")
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        getRestaurants() 
    }, [])
    
    const restaurantsList = store.restaurants.map((restaurant) => {
        return <option value={restaurant.id} key={restaurant.id}>{restaurant.name}</option>
    })
    function handleSubmit(e) {
        e.preventDefault()
        const recipeData = {
            name: name,
            steps: steps,
            img_url: img_url.img_url,
            restaurant_id: restaurant_id
        }
        console.log(recipeData.img_url)
        createRecipe(recipeData)
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
                            <label className="form-label" htmlFor="restaurantid">Restaurant</label>
                            <select className="form-select" onChange={(e) => setRestaurant_id(e.target.value)} value={restaurant_id} name="restaurantid" id="restaurantid">
                                <option value="">Select a restaurant</option>
                                {restaurantsList}
                            </select>
                        </div>

                        <div className="mb-3">
                            <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setImg_url, img_url)} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mb-3">Crear receta</button>

                        <div className="text-center">
                            <Link to="/recipes">Volver a recetas</Link>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    )
}

export default CreateRecipeForm
