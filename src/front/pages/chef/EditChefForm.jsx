import React, { useEffect, useState } from "react";
import { useChef } from "../../hooks/useChef";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";

const EditChefForm = () => {

    const { store } = useGlobalReducer()
    const [chefData, setChefData] = useState({name: "", email: "", password: "", restaurant_id: ""})
    const { getSingleChef, editChef } = useChef()
    const { chef_id } = useParams()
    const { getRestaurants } = useRestaurant()

    useEffect(() => {
        getSingleChef(chef_id)
        getRestaurants()
    }, [])
    useEffect(() => {
        if (store.singleChef.id) {
            setChefData({
                name: store.singleChef.name,
                email: store.singleChef.email,
                password: "",
                restaurant_id: store.singleChef.restaurant_id
            })
        }
    }, [store.singleChef])

    const restaurants = store.restaurants.map((restaurant) => {
        return <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
    })
    
    return (
        <div className="chef_form d-flex flex-column align-items-center gap-3">
            <h1>Edit chef</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e)=>setChefData({...chefData, name: e.target.value})} value={chefData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e)=>setChefData({...chefData, email: e.target.value})} value={chefData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="phone">Password</label>
                <input onChange={(e)=>setChefData({...chefData, password: e.target.value})} value={chefData.password} type="password" name="password" id="password" />
            </div>
            <div>
                <label htmlFor="restaurantid">Restaurant</label>
                <select onChange={(e)=>setChefData({...chefData, restaurant_id: e.target.value})} value={chefData.restaurant_id} name="restaurantid" id="restaurantid">
                    <option value="">Select a restaurant</option>
                    {restaurants}
                </select>
            </div>
            <button onClick={()=>editChef(chef_id, chefData)} className="btn btn-primary">Edit chef</button>
            <Link to="/chefs">Back to chefs</Link>
        </div>
    )
}

export default EditChefForm;