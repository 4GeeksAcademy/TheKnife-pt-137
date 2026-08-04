import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import { useChef } from "../../hooks/useChef";


const ChefDashboard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { chefLogout } = useChef()

    useEffect(() => {
        const chefLogged = !!localStorage.getItem("cheftoken")
        if (!chefLogged) {
            navigate("/chef_login")
        }
    }, [])

    const currentChef = store.loggedChef.chef

    return (
        <div className="chef_dashboard">
            <h1>Welcome back, {currentChef.name}</h1>
            <h2>Restaurant: {currentChef.restaurant_name}</h2>
            <button onClick={chefLogout} className="btn btn-primary">Log out</button>
            <div className="chef-actions d-flex flex-column align-items-start gap-2">
                <h2>Actions</h2>
                <Link to={`/restaurants/${currentChef.restaurant_id}/register_waiter`}><button className="btn btn-primary">Register a waiter</button></Link>
                <Link to={`/restaurants/${currentChef.restaurant_id}/waiters`}><button className="btn btn-warning">Waiter list</button></Link>
                <Link to={`/restaurants/${currentChef.restaurant_id}/register_cook`}><button className="btn btn-primary">Register a Cook</button></Link>
                <Link to={`/restaurants/${currentChef.restaurant_id}/cooks`}><button className="btn btn-warning">Cook list</button></Link>
                <Link to={`/restaurants/${currentChef.restaurant_id}/recipes`}><button className="btn btn-danger">Recipes list</button></Link>
                <Link to={`/restaurants/${currentChef.restaurant_id}/orders`}><button className="btn btn-success">Orders list</button></Link>
                <Link to={`/restaurants/${currentChef.restaurant_id}/products`}><button className="btn btn-dark">Products list</button></Link>
            </div>
        </div>
    )
}

export default ChefDashboard;