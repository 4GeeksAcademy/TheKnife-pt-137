import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import { useChef } from "../../hooks/useChef";
import { useRestaurant } from "../../hooks/useRestaurant";

const ChefDashboard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { chefLogout, chefLogin, rehydrateChef } = useChef()
    const { chefDeleteRestaurant } = useRestaurant()

    useEffect(() => {
        const chefLogged = !!localStorage.getItem("cheftoken")
        if (!chefLogged) {
            navigate("/chef_login")
        } else if (!store.loggedChef.chef.id) {
            rehydrateChef()
        }
    }, [])

    const currentChef = store.loggedChef.chef

    async function handleDeleteRestaurant() {
        const confirmation = window.prompt("If you delete the restaurant, all items related to it will be deleted also\n Enter 'DELETE' to delete the restaurant.")
        if (confirmation != "DELETE") return
        chefDeleteRestaurant(currentChef.restaurant_id)
    }

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Welcome back, {currentChef.name}</h1>
                    <h2 className="h5 text-muted mb-0">Restaurant: {currentChef.restaurant_name}</h2>
                </div>
                <button onClick={chefLogout} className="btn btn-primary">Log out</button>
            </div>

            <div className="card mb-4">
                <div className="card-header">Restaurant</div>
                <div className="card-body d-flex gap-2">
                    <Link style={{display: store.loggedChef.chef.restaurant_id ? "none" : "block"}} to="/register_restaurant" className="btn btn-outline-primary">Create restaurant</Link>
                    <Link to={`/restaurants/${currentChef.restaurant_id}/edit_restaurant`}><button className="btn btn-outline-warning">Edit restaurant</button></Link>
                    <button onClick={handleDeleteRestaurant} className="btn btn-outline-danger">Delete restaurant</button>
                    <Link to={`/restaurants/${currentChef.restaurant_id}`}><button className="btn btn-outline-dark">View restaurant details</button></Link>
                    <Link to={`/maps/${currentChef.restaurant_id}`}><button className="btn btn-outline-success">Map</button></Link>
                </div>
            </div>

            <div className="card">
                <div className="card-header">Actions</div>
                <div className="card-body">

                    <div className="mb-3">
                        <h6 className="text-muted">Waiters</h6>
                        <div className="d-flex gap-2">
                            <Link to={`/restaurants/${currentChef.restaurant_id}/register_waiter`} className="btn btn-primary">Register a waiter</Link>
                            <Link to={`/restaurants/${currentChef.restaurant_id}/waiters`} className="btn btn-warning">Waiter list</Link>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h6 className="text-muted">Cooks</h6>
                        <div className="d-flex gap-2">
                            <Link to={`/restaurants/${currentChef.restaurant_id}/register_cook`} className="btn btn-primary">Register a Cook</Link>
                            <Link to={`/restaurants/${currentChef.restaurant_id}/cooks`} className="btn btn-warning">Cook list</Link>
                        </div>
                    </div>

                    <div className="mb-0">
                        <h6 className="text-muted">Management</h6>
                        <div className="d-flex gap-2">
                            <Link to={`/restaurants/${currentChef.restaurant_id}/recipes`} className="btn btn-danger">Recipes list</Link>
                            <Link to={`/restaurants/${currentChef.restaurant_id}/orders`} className="btn btn-success">Orders list</Link>
                            <Link to={`/restaurants/${currentChef.restaurant_id}/products`} className="btn btn-dark">Products list</Link>
                            <Link to="/chef_ingredients" className="btn btn-info">Ingredients list</Link>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default ChefDashboard;