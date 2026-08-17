import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom";
import { useClient } from "../../hooks/useClient";

const ACTIONS = [
    {
        to: "/client_reservations", icon: "fa-calendar-check", title: "Mis reservas",
        text: "Consulta, edita o cancela tus próximas reservas.",
        label: "Ver reservas", variant: "outline",
    },
    {
        to: "/restaurants/nearby_search", icon: "fa-map-location-dot", title: "Restaurantes cercanos",
        text: "Descubre restaurantes cerca de tu ubicación.",
        label: "Buscar cerca", variant: "outline",
    },
    {
        to: "/restaurants/occasion_search", icon: "fa-champagne-glasses", title: "Buscar por ocasión",
        text: "Encuentra el restaurante perfecto para cada plan.",
        label: "Explorar", variant: "outline",
    },
    {
        to: "/restaurants/view_all", icon: "fa-store", title: "Todos los restaurantes",
        text: "Explora el catálogo completo de restaurantes.",
        label: "Ver todos", variant: "primary",
    },
]

const ClientDashboard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { rehydrateClient } = useClient()

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
        <div className="client-dashboard">

            <div className="client-page-header">
                <div>
                    <h1 className="dashboard-welcome-title">Bienvenido, {currentClient.name}</h1>
                    <div className="dashboard-welcome-subtitle">
                        <i className="fa-solid fa-utensils"></i>
                        Encuentra tu próxima mesa
                    </div>
                </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-4">
                {ACTIONS.map((action) => (
                    <div className="col" key={action.to}>
                        <div className="card dashboard-action-card h-100">
                            <div className="card-body d-flex flex-column">
                                <div className="dashboard-action-icon">
                                    <i className={`fa-solid ${action.icon}`}></i>
                                </div>
                                <h2 className="dashboard-action-title">{action.title}</h2>
                                <p className="dashboard-action-text flex-grow-1">{action.text}</p>
                                <Link to={action.to} className={`btn btn-${action.variant === "primary" ? "primary" : "outline-primary"}`}>
                                    {action.label} <i className="fa-solid fa-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default ClientDashboard;
