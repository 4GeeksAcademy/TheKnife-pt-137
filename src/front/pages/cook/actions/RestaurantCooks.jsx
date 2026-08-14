import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useCook } from "../../../hooks/useCook";
import LoadingComponent from "../../../components/LoadingComponent";

const RestaurantCooks = () => {

    const { getRestaurantCooks, deleteRestaurantCook } = useCook();
    const { store } = useGlobalReducer();
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    async function handleDelete(restaurant_id, cook_id) {
        const confirmation = window.prompt("Are you sure you want to delete this user?\n Type 'DELETE' to confirm")
        if (confirmation != "DELETE") return
        deleteRestaurantCook(restaurant_id, cook_id)
    }

    useEffect(() => {
        setLoading(true)
        getRestaurantCooks(restaurant_id).finally(() => setLoading(false))
    }, []);

    if (loading) return <LoadingComponent />

    const cooksList = store.cooks.map((cook) => {
        return <tr key={cook.id}>
            <td>{cook.name}</td>
            <td>{cook.email}</td>
            <td>
                <button onClick={() => handleDelete(restaurant_id, cook.id)} className="btn btn-danger btn-sm">Delete cook</button>
            </td>
        </tr>
    })

    return (
        <div className="cook_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Cocineros</h1>
                <Link to={`/restaurants/${restaurant_id}/register_cook`} className="btn btn-primary">Registrar cocinero</Link>
            </div>
            <div className="card overflow-hidden">
                <div className="card-body p-0">
                    {store.cooks.length > 0 ? (
                        <table className="table table-striped align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cooksList}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted text-center py-4 mb-0">Todavía no hay cocineros registrados.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantCooks;