import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
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
            <h2>Restaurant: {store.loggedChef.restaurant}</h2>
            <button onClick={chefLogout} className="btn btn-primary">Log out</button>
        </div>
    )
}

export default ChefDashboard;