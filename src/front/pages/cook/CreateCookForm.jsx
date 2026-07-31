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
        <div className="cook_form d-flex flex-column align-items-center gap-3">
            <h1>Create new cook</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e) => setCookData({ ...cookData, name: e.target.value })} value={cookData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e) => setCookData({ ...cookData, email: e.target.value })} value={cookData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input onChange={(e) => setCookData({ ...cookData, password: e.target.value })} value={cookData.password} type="password" name="password" id="password" />
            </div>
            <div>
                <label htmlFor="restaurantid">Restaurant</label>
                <select onChange={(e) => setCookData({ ...cookData, restaurant_id: e.target.value })} value={cookData.restaurant_id} name="restaurantid" id="restaurantid" >
                    <option value="">Select a restaurant</option>
                    {restaurantList}
                </select>
            </div>
            <button onClick={() => createCook(cookData)} className="btn btn-primary">Create new cook</button>
            <Link to="/cooks">Back to cooks</Link>
        </div>
    )
}

export default CreateCookForm;