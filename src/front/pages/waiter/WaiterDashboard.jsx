import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { useWaiter } from "../../hooks/useWaiter";


const WaiterDashboard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { waiterLogout } = useWaiter()

    useEffect(() => {
        const waiterLogged = !!localStorage.getItem("waitertoken")
        if (!waiterLogged) {
            navigate("/waiter_login")
        }
    }, [])

    const currentWaiter = store.loggedWaiter.waiter

    return (
        <div className="waiter_dashboard">
            <h1>Welcome back, {currentWaiter.name}</h1>
            <h2>Restaurant: {store.loggedWaiter.restaurant}</h2>
            <button onClick={waiterLogout} className="btn btn-primary">Log out</button>
        </div>
    )
}

export default WaiterDashboard;