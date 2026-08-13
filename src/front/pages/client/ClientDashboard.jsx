import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom";
import { useClient } from "../../hooks/useClient";

const ClientDashboard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { clientLogout, rehydrateClient } = useClient()

    useEffect(() => {
        const clientLogged = !!localStorage.getItem("clienttoken")
        if (!clientLogged) {
            navigate("/client_login")
        } else if (!store.loggedClient.client.id) {
            rehydrateClient()
        }
    }, [])

    const currentClient = store.loggedClient.client

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Welcome back, {currentClient.name}</h1>
                </div>
                <button onClick={clientLogout} className="btn btn-primary">Log out</button>
            </div>

            <div className="card">
                <div className="card-header">Actions</div>
                <div className="card-body d-flex flex-wrap gap-2">
                    <Link to="/restaurants/nearby_search" className="btn btn-primary">Look nearby restaurants</Link>
                    <Link to="/restaurants/occasion_search" className="btn btn-outline-primary">Search by occasion</Link>
                </div>
            </div>

        </div>
    )
}

export default ClientDashboard;
