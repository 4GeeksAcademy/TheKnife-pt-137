import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { useHost } from "../../hooks/useHost";

const HostDashboard = () => {

    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const { hostLogout, rehydrateHost } = useHost();

    useEffect(() => {
        const hostLogged = !!localStorage.getItem("hosttoken");
        if (!hostLogged) {
            navigate("/host_login");
        } else if (!store.loggedHost.host.id) {
            rehydrateHost();
        }
    }, []);

    const currentHost = store.loggedHost.host;

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Welcome back, {currentHost.name}</h1>
                    <h2 className="h5 text-muted mb-0">Restaurant: {store.loggedHost.restaurant}</h2>
                </div>
                <button onClick={hostLogout} className="btn btn-primary">Log out</button>
            </div>

            <div className="card">
                <div className="card-header">Host</div>
                <div className="card-body">
                    <p className="mb-0 text-muted">Bienvenido a tu panel de host.</p>
                </div>
            </div>

        </div>
    );
};

export default HostDashboard;
