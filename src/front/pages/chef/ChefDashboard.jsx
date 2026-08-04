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

    useEffect(() => {
        console.log(store.loggedChef)
    }, [store.loggedChef])

    const currentChef = store.loggedChef.chef

    return (
        <div className="chef_dashboard">
            <h1>Welcome back, {currentChef.name}</h1>
            <h2>Restaurant: {currentChef.restaurant_name}</h2>
            <button onClick={chefLogout} className="btn btn-primary">Log out</button>
            <div className="chef-actions d-flex flex-column align-items-start gap-2">
                <h2>Actions</h2>
                <Link to={`/restaurants/${currentChef.restaurant_id}/register_waiter`}><button className="btn btn-primary">Register a waiter</button></Link>
                <button className="btn btn-warning">Restaurant waiter list</button>
                <Link to={`/restaurants/${currentChef.restaurant_id}/register_cook`}><button className="btn btn-primary">Register a Cook</button></Link>
                <button className="btn btn-warning">Restaurant cook list</button>
                <button className="btn btn-danger">Restaurant recipes list</button>
                <button className="btn btn-success">Restaurant orders list</button>
                <button className="btn btn-dark">Restaurant products list</button>
            </div>
        </div>
    )
}

export default ChefDashboard;