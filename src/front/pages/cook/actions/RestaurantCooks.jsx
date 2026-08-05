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
        return <tr key={cook.id}>
            <td>{cook.name}</td>
            <td>{cook.email}</td>
            <td>
                <button onClick={() => deleteRestaurantCook(restaurant_id, cook.id)} className="btn btn-danger btn-sm">Delete cook</button>
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