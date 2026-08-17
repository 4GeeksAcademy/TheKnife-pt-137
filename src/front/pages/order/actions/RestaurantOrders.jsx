import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../../hooks/useOrder";
import { useInterval } from "../../../hooks/useInterval";
import LoadingComponent from "../../../components/LoadingComponent";

const OPEN_STATES = "pending,doing,done"
const POLL_INTERVAL_MS = 5000

const STATE_INFO = {
    pending: { label: "Pendiente", badgeClass: "order-badge-pending", icon: "fa-hourglass-half" },
    doing: { label: "En preparación", badgeClass: "order-badge-doing", icon: "fa-fire-burner" },
    done: { label: "Listo", badgeClass: "order-badge-done", icon: "fa-bell-concierge" },
    closed: { label: "Cerrado", badgeClass: "order-badge-closed", icon: "fa-circle-check" },
}

const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "—"

const RestaurantOrders = () => {

    const { getAllRestaurantOrders } = useOrder()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [showClosed, setShowClosed] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantOrders(restaurant_id, showClosed ? "closed" : OPEN_STATES).finally(() => setLoading(false))
    }, [showClosed])

    // Refresca en segundo plano para que sala vea los cambios de estado de cocina sin recargar la página.
    useInterval(() => {
        getAllRestaurantOrders(restaurant_id, showClosed ? "closed" : OPEN_STATES)
    }, POLL_INTERVAL_MS)

    if (loading) return <LoadingComponent />

    const ordersList = store.orders.map((order) => {
        const stateInfo = STATE_INFO[order.state] || STATE_INFO.pending
        return (
            <div className="product-row" key={order.id}>
                <div className={`order-icon ${stateInfo.badgeClass}`}>
                    <i className={`fa-solid ${stateInfo.icon}`}></i>
                </div>
                <div className="product-row-info">
                    <div className="product-row-title">
                        <span className="product-row-name">Pedido #{order.id}</span>
                        <span className={`product-badge ${stateInfo.badgeClass}`}>{stateInfo.label}</span>
                    </div>
                    <div className="order-row-meta">
                        <span><i className="fa-solid fa-chair"></i>Mesa {order.table_number ?? order.table_id}</span>
                        <span><i className="fa-solid fa-user"></i>{order.waiter_name || "Sin camarero"}</span>
                        <span><i className="fa-solid fa-users"></i>{order.people} personas</span>
                        <span><i className="fa-solid fa-clock"></i>{formatDateTime(order.date_time)}</span>
                    </div>
                </div>
                <Link className="recipe-view-link" to={`/restaurants/${restaurant_id}/orders/${order.id}`}>
                    Ver pedido <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>
        )
    })

    return (
        <div className="order_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Pedidos</h1>
            </div>

            <div className="product-toolbar">
                <div className="product-filter-tabs">
                    <button type="button" className={`product-filter-btn ${!showClosed ? "active" : ""}`} onClick={() => setShowClosed(false)}>Abiertos</button>
                    <button type="button" className={`product-filter-btn ${showClosed ? "active" : ""}`} onClick={() => setShowClosed(true)}>Cerrados</button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    {store.orders.length > 0 ? (
                        <div className="product-list">
                            {ordersList}
                        </div>
                    ) : (
                        <p className="text-muted text-center py-3 mb-0">No hay pedidos que mostrar.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantOrders;
