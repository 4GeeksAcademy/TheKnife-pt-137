import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
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
        <div className="waiter_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Camareros</h1>
                <Link to={`/restaurants/${restaurant_id}/register_waiter`} className="btn btn-primary">Registrar camarero</Link>
            </div>
            <div className="card overflow-hidden">
                <div className="card-body p-0">
                    {store.waiters.length > 0 ? (
                        <table className="table table-striped align-middle mb-0">
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
                    ) : (
                        <p className="text-muted text-center py-4 mb-0">Todavía no hay camareros registrados.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantWaiters;