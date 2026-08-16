import { NavLink } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useChef } from "../../hooks/useChef"

const NAV_GROUPS = (restaurantId) => ([
    {
        key: "restaurant",
        label: "Restaurante",
        icon: "fa-store",
        items: [
            { to: `/restaurants/${restaurantId}`, label: "Detalles", end: true },
            { to: `/restaurants/${restaurantId}/edit_restaurant`, label: "Editar restaurante" },
            { to: `/maps/${restaurantId}`, label: "Ubicación" },
        ],
    },
    {
        key: "waiters",
        label: "Camareros",
        icon: "fa-user-tie",
        items: [
            { to: `/restaurants/${restaurantId}/waiters`, label: "Lista de camareros" },
            { to: `/restaurants/${restaurantId}/register_waiter`, label: "Registrar camarero" },
        ],
    },
    {
        key: "cooks",
        label: "Cocineros",
        icon: "fa-kitchen-set",
        items: [
            { to: `/restaurants/${restaurantId}/cooks`, label: "Lista de cocineros" },
            { to: `/restaurants/${restaurantId}/register_cook`, label: "Registrar cocinero" },
        ],
    },
    {
        key: "host",
        label: "Host",
        icon: "fa-door-open",
        items: [
            { to: `/restaurants/${restaurantId}/register_host`, label: "Registrar host" },
        ],
    },
    {
        key: "management",
        label: "Gestión",
        icon: "fa-clipboard-list",
        items: [
            { to: `/restaurants/${restaurantId}/recipes`, label: "Recetas" },
            { to: `/restaurants/${restaurantId}/orders`, label: "Pedidos" },
            { to: `/restaurants/${restaurantId}/products`, label: "Productos" },
            { to: "/chef_ingredients", label: "Ingredientes" },
        ],
    },
])

const closeMobileOffcanvas = () => {
    const el = document.getElementById("chefSidebarOffcanvas")
    if (!el || !window.bootstrap) return
    window.bootstrap.Offcanvas.getOrCreateInstance(el).hide()
}

const ChefSidebarContent = ({ idPrefix, onNavigate }) => {

    const { store } = useGlobalReducer()
    const { chefLogout } = useChef()
    const currentChef = store.loggedChef.chef
    const restaurantId = currentChef.restaurant_id

    return (
        <div className="chef-sidebar-inner d-flex flex-column h-100">

            <div className="chef-sidebar-brand px-3 py-3">
                <span className="fw-semibold text-white">Panel del chef</span>
                {currentChef.restaurant_name && (
                    <div className="small text-white-50 text-truncate">{currentChef.restaurant_name}</div>
                )}
            </div>

            <nav className="chef-sidebar-nav flex-grow-1 overflow-auto px-2 py-2">
                <NavLink to="/chef_dashboard" end onClick={onNavigate}
                    className={({ isActive }) => `nav-link chef-nav-link ${isActive ? "active" : ""}`}>
                    <i className="fa-solid fa-gauge-high me-2"></i> Resumen
                </NavLink>

                {!restaurantId && (
                    <NavLink to="/register_restaurant" onClick={onNavigate}
                        className={({ isActive }) => `nav-link chef-nav-link ${isActive ? "active" : ""}`}>
                        <i className="fa-solid fa-plus me-2"></i> Crear restaurante
                    </NavLink>
                )}

                {restaurantId && NAV_GROUPS(restaurantId).map((group) => (
                    <div className="chef-nav-group" key={group.key}>
                        <button
                            className="chef-nav-group-toggle btn w-100 collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${idPrefix}-${group.key}`}
                            aria-expanded="false"
                        >
                            <i className={`fa-solid ${group.icon} me-2`}></i>
                            <span>{group.label}</span>
                            <i className="fa-solid fa-chevron-down chef-nav-chevron"></i>
                        </button>
                        <div className="collapse" id={`${idPrefix}-${group.key}`}>
                            <div className="chef-nav-subitems">
                                {group.items.map((item) => (
                                    <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate}
                                        className={({ isActive }) => `nav-link chef-nav-sublink ${isActive ? "active" : ""}`}>
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </nav>

            <div className="chef-sidebar-footer px-3 py-3">
                <div className="text-white small text-truncate mb-2">{currentChef.name}</div>
                <button onClick={chefLogout} className="btn btn-outline-light btn-sm w-100">
                    <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesión
                </button>
            </div>

        </div>
    )
}

const ChefSidebar = () => {
    return (
        <>
            <aside className="chef-sidebar d-none d-lg-block">
                <ChefSidebarContent idPrefix="d" />
            </aside>

            <div className="chef-mobile-topbar d-flex d-lg-none align-items-center px-3 py-2">
                <button className="btn btn-chef-brand btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#chefSidebarOffcanvas">
                    <i className="fa-solid fa-bars me-2"></i>Menú
                </button>
            </div>

            <div className="offcanvas offcanvas-start chef-sidebar-offcanvas d-lg-none" tabIndex="-1" id="chefSidebarOffcanvas">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    <ChefSidebarContent idPrefix="m" onNavigate={closeMobileOffcanvas} />
                </div>
            </div>
        </>
    )
}

export default ChefSidebar
