import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import { useWaiter } from "../../hooks/useWaiter";

const WaiterDashboard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { waiterLogout, rehydrateWaiter } = useWaiter()

    useEffect(() => {
        const waiterLogged = !!localStorage.getItem("waitertoken")
        if (!waiterLogged) {
            navigate("/waiter_login")
        } else if (!store.loggedWaiter.waiter.id) {
            rehydrateWaiter()
        }
    }, [])

    const currentWaiter = store.loggedWaiter.waiter

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Welcome back, {currentWaiter.name}</h1>
                    <h2 className="h5 text-muted mb-0">Restaurant: {currentWaiter.restaurant_name}</h2>
                </div>
                <button onClick={waiterLogout} className="btn btn-primary">Log out</button>
            </div>

            <div className="card">
                <div className="card-header">Actions</div>
                <div className="card-body">

                    <div className="mb-3">
                        <h6 className="text-muted">Recipes</h6>
                        <div className="d-flex gap-2">
                            <Link to="/waiter_recipes" className="btn btn-danger">Recipes list</Link>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h6 className="text-muted">Comandas</h6>
                        <div className="d-flex gap-2">
                            <Link to="/waiter_orders/create" className="btn btn-primary">Create comanda</Link>
                            <Link to="/waiter_orders" className="btn btn-success">Comandas list</Link>
                        </div>
                    </div>

                    <div className="mb-0">
                        <h6 className="text-muted">Mesas</h6>
                        <div className="d-flex gap-2">
                            <Link to="/waiter_tables" className="btn btn-dark">Tables list</Link>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default WaiterDashboard;