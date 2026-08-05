import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useCook } from "../../../hooks/useCook";

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

    if (loading) return <p className="text-center mt-5">Loading...</p>

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
        <div className="cook_page container py-4">
            <h1 className="h4 mb-3">Cooks</h1>
            <table className="table table-striped align-middle">
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
            <Link to="/chef_dashboard">Back to dashboard</Link>
        </div>
    )
}

export default RestaurantCooks;