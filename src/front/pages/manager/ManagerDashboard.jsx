import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom";
import { useManager } from "../../hooks/useManager";

const ManagerDashboard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { managerLogout, rehydrateManager } = useManager()

    useEffect(() => {
        const managerLogged = !!localStorage.getItem("managertoken")
        if (!managerLogged) {
            navigate("/manager_login")
        } else if (!store.loggedManager.manager.id) {
            rehydrateManager()
        }
    }, [])

    const currentManager = store.loggedManager.manager

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Welcome back, {currentManager.name}</h1>
                </div>
                <button onClick={managerLogout} className="btn btn-primary">Log out</button>
            </div>

            <div className="card">
                <div className="card-header">Actions</div>
                <div className="card-body d-flex gap-2">
                    <Link to="/managers" className="btn btn-dark">Managers list</Link>
                </div>
            </div>

        </div>
    )
}

export default ManagerDashboard;