import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useParams } from "react-router-dom";
import { useWaiter } from "../../../hooks/useWaiter";
import LoadingComponent from "../../../components/LoadingComponent";

const RestaurantWaiters = () => {

    const { getRestaurantWaiters, deleteRestaurantWaiter } = useWaiter();
    const { store } = useGlobalReducer();
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    async function handleDelete(restaurant_id, waiter_id) {
        const confirmation = window.prompt("Are you sure you want to delete this user? \n Insert 'DELETE' to confirm")
        if (confirmation != "DELETE") return
        deleteRestaurantWaiter(restaurant_id, waiter_id)
    }

    useEffect(() => {
        setLoading(true)
        getRestaurantWaiters(restaurant_id).finally(() => setLoading(false))
    }, []);

    if (loading) return <LoadingComponent />

    const waitersList = store.waiters.map((waiter) => {
        return <tr key={waiter.id}>
            <td>{waiter.name}</td>
            <td>{waiter.email}</td>
            <td>
                <button onClick={() => handleDelete(restaurant_id, waiter.id)} className="btn btn-danger btn-sm">Delete waiter</button>
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
        </div>
    )
}

export default RestaurantWaiters;