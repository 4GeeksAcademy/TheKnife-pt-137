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
        return <tr key={waiter.id}>
            <td>{waiter.name}</td>
            <td>{waiter.email}</td>
            <td>
                <button onClick={() => deleteRestaurantWaiter(restaurant_id, waiter.id)} className="btn btn-danger btn-sm">Delete waiter</button>
            </td>
        </tr>
    })

    return (
        <div className="waiter_page container py-4">
            <h1 className="h4 mb-3">Waiters</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {waitersList}
                </tbody>
            </table>
            <Link to="/chef_dashboard">Back to dashboard</Link>
        </div>
    )
}

export default RestaurantWaiters;