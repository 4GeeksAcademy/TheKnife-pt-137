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
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new chef</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, name: e.target.value})} value={chefData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, email: e.target.value})} value={chefData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, password: e.target.value})} value={chefData.password} type="password" name="password" id="password" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="restaurantid">Restaurant</label>
                        <select className="form-select" onChange={(e)=>setChefData({...chefData, restaurant_id: e.target.value})} value={chefData.restaurant_id} name="restaurantid" id="restaurantid">
                            <option value="">Select a restaurant</option>
                            {restaurants}
                        </select>
                    </div>

                    <button onClick={()=>createChef(chefData)} className="btn btn-primary w-100 mb-3">Create new chef</button>

                    <div className="text-center">
                        <Link to="/chefs">Back to chefs</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateChefForm;