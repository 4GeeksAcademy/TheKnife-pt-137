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
                <div className="card-body">
                    <div className="mb-0">
                        <h6 className="text-muted">CRUD resources</h6>
                        <div className="d-flex flex-wrap gap-2">
                            <Link to="/products" className="btn btn-primary">Products</Link>
                            <Link to="/recipes" className="btn btn-secondary">Recipes</Link>
                            <Link to="/restaurants" className="btn btn-success">Restaurants</Link>
                            <Link to="/ingredients" className="btn btn-warning">Ingredients</Link>
                            <Link to="/orders" className="btn btn-danger">Orders</Link>
                            <Link to="/tables" className="btn btn-info">Tables</Link>
                            <Link to="/reservations" className="btn btn-outline-info">Reservations</Link>
                            <Link to="/chefs" className="btn btn-dark">Chefs</Link>
                            <Link to="/hosts" className="btn btn-outline-success">Hosts</Link>
                            <Link to="/cooks" className="btn btn-outline-primary">Cooks</Link>
                            <Link to="/waiters" className="btn btn-outline-secondary">Waiters</Link>
                            <Link to="/managers" className="btn btn-outline-dark">Managers</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ManagerDashboard;