import React, { useEffect, useState } from "react";
import { useWaiter } from "../../hooks/useWaiter";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";
import useGlobalReducer from "../../hooks/useGlobalReducer";


const CreateWaiterForm = () => {

    const { store } = useGlobalReducer()
    const [waiterData, setWaiterData] = useState({name: "", email: "", password: "", restaurant_id: ""})
    const { createWaiter } = useWaiter()
    const { getRestaurants } = useRestaurant()

    useEffect(() => {
        getRestaurants()
    }, [])

    const restaurantList = store.restaurants.map((restaurant) => {
        return <option value={restaurant.id} key={restaurant.id}>{restaurant.name}</option>
    })

    return (
        <div className="waiter_form d-flex flex-column align-items-center gap-3">
            <h1>Create new waiter</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e)=>setWaiterData({...waiterData, name: e.target.value})} value={waiterData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e)=>setWaiterData({...waiterData, email: e.target.value})} value={waiterData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input onChange={(e)=>setWaiterData({...waiterData, password: e.target.value})} value={waiterData.password} type="password" name="password" id="password" />
            </div>
            <div>
                <label htmlFor="restaurantid">Restaurant</label>
                <select onChange={(e)=>setWaiterData({...waiterData, restaurant_id: e.target.value})} value={waiterData.restaurant_id} name="restaurantid" id="restaurantid" >
                    <option value="">Select a restaurant</option>
                    {restaurantList}
                </select>
            </div>
            <button onClick={()=>createWaiter(waiterData)} className="btn btn-primary">Create new waiter</button>
            <Link to="/waiters">Back to waiters</Link>
        </div>
    )
}

export default CreateWaiterForm;