import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";

const Restaurants = () => {

    const { getRestaurants, deleteRestaurant } = useRestaurant()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getRestaurants().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const restaurantsList = store.restaurants.map((restaurant) => {
        return <tr key={restaurant.id}>
            <td><img src={restaurant.img_url} height="50" width="50" style={{ objectFit: "cover" }} /></td>
            <td>{restaurant.name}</td>
            <td>{restaurant.email}</td>
            <td>{restaurant.phone}</td>
            <td>{restaurant.address}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteRestaurant(restaurant.id)}>Delete</button>
                <Link to={`/edit_restaurant/${restaurant.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_restaurant/${restaurant.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="restaurant_page container py-4">
            <Link to="/create_restaurant"><button className="btn btn-primary mb-4">Add restaurant</button></Link>
            <h1 className="h4 mb-3">Restaurants</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {restaurantsList}
                </tbody>
            </table>
        </div>
    )
}

export default Restaurants;