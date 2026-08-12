import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
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

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            <h3 className="h5">Reservations</h3>
                            <p className="text-muted flex-grow-1">See all the reservations of your restaurant.</p>
                            <Link to="/host_reservations" className="btn btn-outline-primary mt-auto">View reservations</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            <h3 className="h5">New reservation</h3>
                            <p className="text-muted flex-grow-1">Create a reservation manually for a walk-in or guest client.</p>
                            <Link to="/host_create_reservation" className="btn btn-primary mt-auto">Create reservation</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HostDashboard;
