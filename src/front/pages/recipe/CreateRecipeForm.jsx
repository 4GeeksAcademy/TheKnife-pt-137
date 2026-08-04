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
        <div>
            <h1>Crear receta</h1>

            <form onSubmit={handleSubmit}>

                <label>Nombre de la receta</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label>Pasos</label>
                <textarea
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                />

                <input type="file" onChange={(e) => uploadImage(e, "cocinapp_images", setImg_url, img_url)} />
                <div>
                    <label htmlFor="restaurant">Restaurant</label>
                    <select onChange={(e) => setRestaurant_id(e.target.value)} value={restaurant_id} name="restaurantid" id="restaurantid">
                        <option value="">Select a restaurant</option>
                        {restaurantsList}
                    </select>
                </div>
                <button type="submit">Crear receta</button>
                <Link to="/recipes">
                    Volver a recetas
                </Link>
            </form>

        </div>
    )
}

export default CreateRecipeForm
