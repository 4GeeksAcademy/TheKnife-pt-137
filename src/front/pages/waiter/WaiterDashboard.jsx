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
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Welcome back, {currentWaiter.name}</h1>
                    <h2 className="h5 text-muted mb-0">Restaurant: {store.loggedWaiter.restaurant}</h2>
                </div>
                <button onClick={waiterLogout} className="btn btn-primary">Log out</button>
            </div>

        </div>
    )
}

export default WaiterDashboard;