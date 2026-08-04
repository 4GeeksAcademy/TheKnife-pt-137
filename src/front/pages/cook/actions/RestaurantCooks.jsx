import React, { useEffect } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useCook } from "../../../hooks/useCook";

const RestaurantCooks = () => {

    const { getRestaurantCooks, deleteRestaurantCook } = useCook();
    const { store } = useGlobalReducer();
    const { restaurant_id } = useParams()

    useEffect(() => {
        getRestaurantCooks(restaurant_id);
    }, []);

    const cooksList = store.cooks.map((cook) => {
        return <div key={cook.id} className="cook d-flex align-items-center gap-3">
            <span>Name: {cook.name}</span>
            <span>Email: {cook.email}</span>
            <button onClick={()=>deleteRestaurantCook(restaurant_id, cook.id)} className="btn btn-danger">Delete cook</button>
        </div>
    })

    return (
        <div className="cook_page d-flex flex-column align-items-center gap-3 mt-4">
            <div className="cooks d-flex flex-column  align-items-center gap-2">
                <h1>Cooks</h1>
                {cooksList}
                <Link to="/chef_dashboard">Back to dashboard</Link>
            </div>
        </div>
    )
}

export default RestaurantCooks;