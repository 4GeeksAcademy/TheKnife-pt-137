import React, { useEffect } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useWaiter } from "../../../hooks/useWaiter";

const RestaurantWaiters = () => {

    const { getRestaurantWaiters, deleteRestaurantWaiter } = useWaiter();
    const { store } = useGlobalReducer();
    const { restaurant_id } = useParams()

    useEffect(() => {
        getRestaurantWaiters(restaurant_id);
    }, []);

    const waitersList = store.waiters.map((waiter) => {
        return <div key={waiter.id} className="waiter d-flex align-items-center gap-3">
            <span>Name: {waiter.name}</span>
            <span>Email: {waiter.email}</span>
            <button onClick={()=>deleteRestaurantWaiter(restaurant_id, waiter.id)} className="btn btn-danger">Delete waiter</button>
        </div>
    })

    return (
        <div className="waiter_page d-flex flex-column align-items-center gap-3 mt-4">
            <div className="waiters d-flex flex-column  align-items-center gap-2">
                <h1>Waiters</h1>
                {waitersList}
                <Link to="/chef_dashboard">Back to dashboard</Link>
            </div>
        </div>
    )
}

export default RestaurantWaiters;