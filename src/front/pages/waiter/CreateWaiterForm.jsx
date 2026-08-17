import React, { useEffect, useState } from "react";
import { useWaiter } from "../../hooks/useWaiter";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useCloudinary } from "../../hooks/useCloudinary";


const CreateWaiterForm = () => {

    const { store } = useGlobalReducer()
    const [waiterData, setWaiterData] = useState({name: "", email: "", password: "", img_url: "", restaurant_id: ""})
    const { createWaiter } = useWaiter()
    const { getRestaurants } = useRestaurant()
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        getRestaurants()
    }, [])

    const restaurantList = store.restaurants.map((restaurant) => {
        return <option value={restaurant.id} key={restaurant.id}>{restaurant.name}</option>
    })

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new waiter</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e)=>setWaiterData({...waiterData, name: e.target.value})} value={waiterData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setWaiterData({...waiterData, email: e.target.value})} value={waiterData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e)=>setWaiterData({...waiterData, password: e.target.value})} value={waiterData.password} type="password" name="password" id="password" />
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e)=>uploadImage(e,"cocinapp_images",setWaiterData,waiterData)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="restaurantid">Restaurant</label>
                        <select className="form-select" onChange={(e)=>setWaiterData({...waiterData, restaurant_id: e.target.value})} value={waiterData.restaurant_id} name="restaurantid" id="restaurantid" >
                            <option value="">Select a restaurant</option>
                            {restaurantList}
                        </select>
                    </div>

                    <button onClick={()=>createWaiter(waiterData)} className="btn btn-primary w-100 mb-3">Create new waiter</button>

                    <div className="text-center">
                        <Link to="/waiters">Back to waiters</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateWaiterForm;