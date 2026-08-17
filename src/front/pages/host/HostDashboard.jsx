import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useHost } from "../../hooks/useHost";

const HostDashboard = () => {

    const { store } = useGlobalReducer();
    const { rehydrateHost } = useHost();

    useEffect(() => {
        if (!store.loggedHost.host.id) {
            rehydrateHost();
        }
    }, []);

    const currentHost = store.loggedHost.host;

    return (
        <div className="host-dashboard">

            <div className="host-page-header">
                <div>
                    <h1 className="dashboard-welcome-title">Bienvenido, {currentHost.name}</h1>
                    <div className="dashboard-welcome-subtitle">
                        <i className="fa-solid fa-store"></i>
                        Restaurante: {currentHost.restaurant_name}
                    </div>
                </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-4">
                <div className="col">
                    <div className="card dashboard-action-card h-100">
                        <div className="card-body d-flex flex-column">
                            <div className="dashboard-action-icon">
                                <i className="fa-solid fa-calendar-check"></i>
                            </div>
                            <h2 className="dashboard-action-title">Reservas</h2>
                            <p className="dashboard-action-text flex-grow-1">Consulta y gestiona todas las reservas activas de tu restaurante.</p>
                            <Link to="/host_reservations" className="btn btn-outline-primary">
                                Ver reservas <i className="fa-solid fa-arrow-right ms-1"></i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card dashboard-action-card h-100">
                        <div className="card-body d-flex flex-column">
                            <div className="dashboard-action-icon">
                                <i className="fa-solid fa-calendar-plus"></i>
                            </div>
                            <h2 className="dashboard-action-title">Nueva reserva</h2>
                            <p className="dashboard-action-text flex-grow-1">Crea una reserva manual para un cliente que llega sin reserva previa.</p>
                            <Link to="/host_create_reservation" className="btn btn-primary">
                                Crear reserva <i className="fa-solid fa-arrow-right ms-1"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HostDashboard;
