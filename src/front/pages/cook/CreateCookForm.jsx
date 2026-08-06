import React, { useEffect, useState } from "react";
import { useCook } from "../../hooks/useCook";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CreateCookForm = () => {

    const { store } = useGlobalReducer();
    const [cookData, setCookData] = useState({ name: "", email: "", password: "", restaurant_id: "" });
    const { createCook } = useCook();
    const { getRestaurants } = useRestaurant();

    useEffect(() => {
        getRestaurants();
    }, []);

    const restaurantList = store.restaurants.map((restaurant) => {
        return <option value={restaurant.id} key={restaurant.id}>{restaurant.name}</option>;
    });

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new cook</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, name: e.target.value })} value={cookData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, email: e.target.value })} value={cookData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, password: e.target.value })} value={cookData.password} type="password" name="password" id="password" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="restaurantid">Restaurant</label>
                        <select className="form-select" onChange={(e) => setCookData({ ...cookData, restaurant_id: e.target.value })} value={cookData.restaurant_id} name="restaurantid" id="restaurantid" >
                            <option value="">Select a restaurant</option>
                            {restaurantList}
                        </select>
                    </div>

                    <button onClick={() => createCook(cookData)} className="btn btn-primary w-100 mb-3">Create new cook</button>

                    <div className="text-center">
                        <Link to="/cooks">Back to cooks</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateCookForm;