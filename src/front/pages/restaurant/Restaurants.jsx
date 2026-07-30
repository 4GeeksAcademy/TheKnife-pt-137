import React, { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";

const Restaurants = () => {

    const { getRestaurants, deleteRestaurant } = useRestaurant()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getRestaurants()
    }, [])

    const restaurantsList = store.restaurants.map((restaurant) => {
        return <div key={restaurant.id} className="restaurant d-flex align-items-center gap-3">
            <span>Name: {restaurant.name}</span>
            <span>Email: {restaurant.email}</span>
            <span>Phone: {restaurant.phone}</span>
            <span>Address: {restaurant.address}</span>
            <button className="btn btn-danger" onClick={() => deleteRestaurant(restaurant.id)}>Delete restaurant</button>
            <Link to={`/edit_restaurant/${restaurant.id}`}><button className="btn btn-warning">Edit restaurant</button></Link>
            <Link to={`/single_restaurant/${restaurant.id}`}><button className="btn btn-primary">View restaurant</button></Link>
        </div>
    })

    return (
        <div className="restaurant_page d-flex flex-column align-items-center gap-3 mt-4">
            <Link to="/create_restaurant"><button className="btn btn-primary">Add restaurant</button></Link>
            <div className="restaurants d-flex flex-column gap-5">
                <h1>Restaurants</h1>
                {restaurantsList}
            </div>
        </div>
    )
}

export default Restaurants;