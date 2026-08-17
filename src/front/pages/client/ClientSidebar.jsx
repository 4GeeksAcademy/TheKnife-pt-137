import { NavLink } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useClient } from "../../hooks/useClient"

const NAV_ITEMS = [
    { to: "/client_reservations", label: "Mis reservas", icon: "fa-calendar-check" },
    { to: "/booking_history", label: "Historial", icon: "fa-clock-rotate-left" },
]

const closeMobileOffcanvas = () => {
    const el = document.getElementById("clientSidebarOffcanvas")
    if (!el || !window.bootstrap) return
    window.bootstrap.Offcanvas.getOrCreateInstance(el).hide()
}

const ClientSidebarContent = ({ onNavigate }) => {

    const { store } = useGlobalReducer()
    const { clientLogout } = useClient()
    const currentClient = store.loggedClient.client

    return (
        <div className="client-sidebar-inner d-flex flex-column h-100">

            <div className="client-sidebar-brand px-3 py-3">
                <span className="fw-semibold text-white">Panel del cliente</span>
                {currentClient.email && (
                    <div className="small text-white-50 text-truncate">{currentClient.email}</div>
                )}
            </div>

            <nav className="client-sidebar-nav flex-grow-1 overflow-auto px-2 py-2">
                <NavLink to="/client_dashboard" end onClick={onNavigate}
                    className={({ isActive }) => `nav-link client-nav-link ${isActive ? "active" : ""}`}>
                    <i className="fa-solid fa-gauge-high me-2"></i> Resumen
                </NavLink>

                {NAV_ITEMS.map((item) => (
                    <NavLink key={item.to} to={item.to} onClick={onNavigate}
                        className={({ isActive }) => `nav-link client-nav-link ${isActive ? "active" : ""}`}>
                        <i className={`fa-solid ${item.icon} me-2`}></i> {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="client-sidebar-footer px-3 py-3">
                <div className="text-white small text-truncate mb-2">{currentClient.name}</div>
                <button onClick={clientLogout} className="btn btn-outline-light btn-sm w-100">
                    <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesión
                </button>
            </div>

        </div>
    )
}

const ClientSidebar = () => {
    return (
        <>
            <aside className="client-sidebar d-none d-lg-block">
                <ClientSidebarContent />
            </aside>

            <div className="client-mobile-topbar d-flex d-lg-none align-items-center px-3 py-2">
                <button className="btn btn-client-brand btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#clientSidebarOffcanvas">
                    <i className="fa-solid fa-bars me-2"></i>Menú
                </button>
            </div>

            <div className="offcanvas offcanvas-start client-sidebar-offcanvas d-lg-none" tabIndex="-1" id="clientSidebarOffcanvas">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <ClientSidebarContent onNavigate={closeMobileOffcanvas} />
                </div>
            </div>
        </>
    )
}

export default ClientSidebar
