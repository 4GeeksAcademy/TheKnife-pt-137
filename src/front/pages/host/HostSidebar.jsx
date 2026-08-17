import { NavLink } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useHost } from "../../hooks/useHost"

const NAV_ITEMS = [
    { to: "/host_reservations", label: "Reservas", icon: "fa-calendar-check" },
    { to: "/host_reservations_history", label: "Historial", icon: "fa-clock-rotate-left" },
    { to: "/host_create_reservation", label: "Nueva reserva", icon: "fa-calendar-plus" },
]

const closeMobileOffcanvas = () => {
    const el = document.getElementById("hostSidebarOffcanvas")
    if (!el || !window.bootstrap) return
    window.bootstrap.Offcanvas.getOrCreateInstance(el).hide()
}

const HostSidebarContent = ({ onNavigate }) => {

    const { store } = useGlobalReducer()
    const { hostLogout } = useHost()
    const currentHost = store.loggedHost.host

    return (
        <div className="host-sidebar-inner d-flex flex-column h-100">

            <div className="host-sidebar-brand px-3 py-3">
                <span className="fw-semibold text-white">Panel del host</span>
                {currentHost.restaurant_name && (
                    <div className="small text-white-50 text-truncate">{currentHost.restaurant_name}</div>
                )}
            </div>

            <nav className="host-sidebar-nav flex-grow-1 overflow-auto px-2 py-2">
                <NavLink to="/host_dashboard" end onClick={onNavigate}
                    className={({ isActive }) => `nav-link host-nav-link ${isActive ? "active" : ""}`}>
                    <i className="fa-solid fa-gauge-high me-2"></i> Resumen
                </NavLink>

                {NAV_ITEMS.map((item) => (
                    <NavLink key={item.to} to={item.to} onClick={onNavigate}
                        className={({ isActive }) => `nav-link host-nav-link ${isActive ? "active" : ""}`}>
                        <i className={`fa-solid ${item.icon} me-2`}></i> {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="host-sidebar-footer px-3 py-3">
                <div className="text-white small text-truncate mb-2">{currentHost.name}</div>
                <button onClick={hostLogout} className="btn btn-outline-light btn-sm w-100">
                    <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesión
                </button>
            </div>

        </div>
    )
}

const HostSidebar = () => {
    return (
        <>
            <aside className="host-sidebar d-none d-lg-block">
                <HostSidebarContent />
            </aside>

            <div className="host-mobile-topbar d-flex d-lg-none align-items-center px-3 py-2">
                <button className="btn btn-host-brand btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#hostSidebarOffcanvas">
                    <i className="fa-solid fa-bars me-2"></i>Menú
                </button>
            </div>

            <div className="offcanvas offcanvas-start host-sidebar-offcanvas d-lg-none" tabIndex="-1" id="hostSidebarOffcanvas">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <HostSidebarContent onNavigate={closeMobileOffcanvas} />
                </div>
            </div>
        </>
    )
}

export default HostSidebar
