import { NavLink } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useCook } from "../../hooks/useCook"

const NAV_ITEMS = (restaurantId) => ([
    { to: `/restaurants/${restaurantId}/cook_recipes`, label: "Recetas", icon: "fa-book-open" },
    { to: `/restaurants/${restaurantId}/cook_orders`, label: "Pedidos", icon: "fa-receipt" },
    { to: "/cook_ingredients", label: "Ingredientes", icon: "fa-carrot" },
])

const closeMobileOffcanvas = () => {
    const el = document.getElementById("cookSidebarOffcanvas")
    if (!el || !window.bootstrap) return
    window.bootstrap.Offcanvas.getOrCreateInstance(el).hide()
}

const CookSidebarContent = ({ onNavigate }) => {

    const { store } = useGlobalReducer()
    const { cookLogout } = useCook()
    const currentCook = store.loggedCook.cook
    const restaurantId = currentCook.restaurant_id

    return (
        <div className="cook-sidebar-inner d-flex flex-column h-100">

            <div className="cook-sidebar-brand px-3 py-3">
                <span className="fw-semibold text-white">Panel del cocinero</span>
                {currentCook.restaurant_name && (
                    <div className="small text-white-50 text-truncate">{currentCook.restaurant_name}</div>
                )}
            </div>

            <nav className="cook-sidebar-nav flex-grow-1 overflow-auto px-2 py-2">
                <NavLink to="/cook_dashboard" end onClick={onNavigate}
                    className={({ isActive }) => `nav-link cook-nav-link ${isActive ? "active" : ""}`}>
                    <i className="fa-solid fa-gauge-high me-2"></i> Resumen
                </NavLink>

                {restaurantId && NAV_ITEMS(restaurantId).map((item) => (
                    <NavLink key={item.to} to={item.to} onClick={onNavigate}
                        className={({ isActive }) => `nav-link cook-nav-link ${isActive ? "active" : ""}`}>
                        <i className={`fa-solid ${item.icon} me-2`}></i> {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="cook-sidebar-footer px-3 py-3">
                <div className="text-white small text-truncate mb-2">{currentCook.name}</div>
                <button onClick={cookLogout} className="btn btn-outline-light btn-sm w-100">
                    <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesión
                </button>
            </div>

        </div>
    )
}

const CookSidebar = () => {
    return (
        <>
            <aside className="cook-sidebar d-none d-lg-block">
                <CookSidebarContent />
            </aside>

            <div className="cook-mobile-topbar d-flex d-lg-none align-items-center px-3 py-2">
                <button className="btn btn-cook-brand btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#cookSidebarOffcanvas">
                    <i className="fa-solid fa-bars me-2"></i>Menú
                </button>
            </div>

            <div className="offcanvas offcanvas-start cook-sidebar-offcanvas d-lg-none" tabIndex="-1" id="cookSidebarOffcanvas">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <CookSidebarContent onNavigate={closeMobileOffcanvas} />
                </div>
            </div>
        </>
    )
}

export default CookSidebar
