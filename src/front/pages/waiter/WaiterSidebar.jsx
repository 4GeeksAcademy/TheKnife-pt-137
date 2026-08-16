import { NavLink } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useWaiter } from "../../hooks/useWaiter"

const closeMobileOffcanvas = () => {
    const el = document.getElementById("waiterSidebarOffcanvas")
    if (!el || !window.bootstrap) return
    window.bootstrap.Offcanvas.getOrCreateInstance(el).hide()
}

const WaiterSidebarContent = ({ onNavigate }) => {

    const { store } = useGlobalReducer()
    const { waiterLogout } = useWaiter()
    const currentWaiter = store.loggedWaiter.waiter

    return (
        <div className="waiter-sidebar-inner d-flex flex-column h-100">

            <div className="waiter-sidebar-brand px-3 py-3">
                <span className="fw-semibold text-white">Panel del camarero</span>
                {currentWaiter.restaurant_name && (
                    <div className="small text-white-50 text-truncate">{currentWaiter.restaurant_name}</div>
                )}
            </div>

            <nav className="waiter-sidebar-nav flex-grow-1 overflow-auto px-2 py-2">
                <NavLink to="/waiter_dashboard" end onClick={onNavigate}
                    className={({ isActive }) => `nav-link waiter-nav-link ${isActive ? "active" : ""}`}>
                    <i className="fa-solid fa-gauge-high me-2"></i> Resumen
                </NavLink>
            </nav>

            <div className="waiter-sidebar-footer px-3 py-3">
                <div className="text-white small text-truncate mb-2">{currentWaiter.name}</div>
                <button onClick={waiterLogout} className="btn btn-outline-light btn-sm w-100">
                    <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesión
                </button>
            </div>

        </div>
    )
}

const WaiterSidebar = () => {
    return (
        <>
            <aside className="waiter-sidebar d-none d-lg-block">
                <WaiterSidebarContent />
            </aside>

            <div className="waiter-mobile-topbar d-flex d-lg-none align-items-center px-3 py-2">
                <button className="btn btn-waiter-brand btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#waiterSidebarOffcanvas">
                    <i className="fa-solid fa-bars me-2"></i>Menú
                </button>
            </div>

            <div className="offcanvas offcanvas-start waiter-sidebar-offcanvas d-lg-none" tabIndex="-1" id="waiterSidebarOffcanvas">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <WaiterSidebarContent onNavigate={closeMobileOffcanvas} />
                </div>
            </div>
        </>
    )
}

export default WaiterSidebar
