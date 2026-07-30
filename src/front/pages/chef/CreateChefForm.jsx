import React, { useEffect, useState } from "react";
import { useChef } from "../../hooks/useChef";
import { Link } from "react-router-dom";
import storeReducer from "../../store";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useRestaurant } from "../../hooks/useRestaurant";

const CreateChefForm = () => {

    const { store } = useGlobalReducer()
    const [chefData, setChefData] = useState({name: "", email: "", password: "", restaurant_id: ""})
    const { createChef } = useChef()
    const { getRestaurants } = useRestaurant()

    useEffect(() => {
        getRestaurants()
    }, [])

    const restaurants = store.restaurants.map((restaurant) => {
        return <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
    })

    return (
        <div className="chef_form d-flex flex-column align-items-center gap-3">
            <h1>Create new chef</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e)=>setChefData({...chefData, name: e.target.value})} value={chefData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e)=>setChefData({...chefData, email: e.target.value})} value={chefData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input onChange={(e)=>setChefData({...chefData, password: e.target.value})} value={chefData.password} type="password" name="password" id="password" />
            </div>
            <div>
                <label htmlFor="restaurantid">Restaurant</label>
                <select onChange={(e)=>setChefData({...chefData, restaurant_id: e.target.value})} value={chefData.restaurant_id} name="restaurantid" id="restaurantid">
                    <option value="">Select a restaurant</option>
                    {restaurants}
                </select>
            </div>
            <button onClick={()=>createChef(chefData)} className="btn btn-primary">Create new chef</button>
            <Link to="/chefs">Back to chefs</Link>
        </div>
    )
}

export default CreateChefForm;