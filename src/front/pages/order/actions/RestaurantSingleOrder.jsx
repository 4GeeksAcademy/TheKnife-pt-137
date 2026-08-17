import { useEffect, useState } from "react"
import { useOrder } from "../../../hooks/useOrder"
import { useOrderProduct } from "../../../hooks/useOrderProduct"
import { useInterval } from "../../../hooks/useInterval"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import LoadingComponent from "../../../components/LoadingComponent"

const POLL_INTERVAL_MS = 5000

const STATE_INFO = {
    pending: { label: "Pendiente", badgeClass: "order-badge-pending", icon: "fa-hourglass-half" },
    doing: { label: "En preparación", badgeClass: "order-badge-doing", icon: "fa-fire-burner" },
    done: { label: "Listo", badgeClass: "order-badge-done", icon: "fa-bell-concierge" },
    closed: { label: "Cerrado", badgeClass: "order-badge-closed", icon: "fa-circle-check" },
}

const formatPrice = (price) =>
    `${Number(price).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`

const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "—"

const RestaurantSingleOrder = () => {

    const { store } = useGlobalReducer()
    const { getSingleRestaurantOrder, closeOrder } = useOrder()
    const { getProductsOfAnOrder, editOrderProduct, deleteOrderProduct } = useOrderProduct()
    const { restaurant_id, order_id } = useParams()
    const [loading, setLoading] = useState(true)
    const isWaiter = !!localStorage.getItem("waitertoken")
    const isCook = !!localStorage.getItem("cooktoken")

    const canEditProducts = isWaiter && store.singleOrder.state !== "closed"

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getSingleRestaurantOrder(restaurant_id, order_id),
            getProductsOfAnOrder(order_id)
        ]).finally(() => setLoading(false))
    }, [restaurant_id, order_id])

    // Refresca en segundo plano para reflejar el estado y los productos del pedido en tiempo real.
    useInterval(() => {
        getSingleRestaurantOrder(restaurant_id, order_id)
        getProductsOfAnOrder(order_id)
    }, POLL_INTERVAL_MS)

    function handleChangeAmount(orderProduct, delta) {
        const newAmount = orderProduct.amount + delta
        if (newAmount < 1) return
        editOrderProduct(orderProduct.id, {
            order_id,
            product_id: orderProduct.product_id,
            amount: newAmount,
            comment: orderProduct.comment
        })
    }

    if (loading) return <LoadingComponent />

    const order = store.singleOrder
    const stateInfo = STATE_INFO[order.state] || STATE_INFO.pending
    const dishes = store.orderProducts.filter((orderProduct) => orderProduct.product_type === "dish")
    const drinks = store.orderProducts.filter((orderProduct) => orderProduct.product_type === "drink")
    const total = store.orderProducts.reduce((sum, op) => sum + Number(op.unit_price) * op.amount, 0)

    const backPath = isWaiter ? "/waiter_dashboard" : isCook ? `/restaurants/${restaurant_id}/cook_orders` : `/restaurants/${restaurant_id}/orders`
    const backLabel = isWaiter ? "Volver al panel" : "Volver a pedidos"

    function renderOrderProductRow(orderProduct) {
        return (
            <div className="product-row" key={orderProduct.id}>
                <div className="product-row-info">
                    <span className="product-row-name">{orderProduct.product_name}</span>
                    {orderProduct.comment && <p className="product-row-desc">{orderProduct.comment}</p>}
                </div>
                <div className="product-row-price">{formatPrice(orderProduct.unit_price * orderProduct.amount)}</div>
                {canEditProducts ? (
                    <div className="product-row-order-controls">
                        <div className="btn-group btn-group-sm" role="group">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => handleChangeAmount(orderProduct, -1)}>-</button>
                            <span className="btn btn-outline-secondary disabled">{orderProduct.amount}</span>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => handleChangeAmount(orderProduct, 1)}>+</button>
                        </div>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteOrderProduct(orderProduct.id, order_id)}>
                            <i className="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                ) : (
                    <span className="order-product-amount">x{orderProduct.amount}</span>
                )}
            </div>
        )
    }

    return (
        <div className="recipe-detail-page">
            <Link to={backPath} className="page-back-link">
                <i className="fa-solid fa-arrow-left"></i>{backLabel}
            </Link>

            <div className="card order-hero">
                <div className={`order-icon order-icon-lg ${stateInfo.badgeClass}`}>
                    <i className={`fa-solid ${stateInfo.icon}`}></i>
                </div>
                <div className="order-hero-body">
                    <div className="order-hero-title-row">
                        <h1 className="order-hero-title">Pedido #{order.id}</h1>
                        <span className={`product-badge ${stateInfo.badgeClass}`}>{stateInfo.label}</span>
                    </div>
                    <div className="recipe-meta">
                        <span><i className="fa-solid fa-chair"></i>Mesa {order.table_number ?? order.table_id}</span>
                        <span><i className="fa-solid fa-user"></i>{order.waiter_name || "Sin camarero"}</span>
                        <span><i className="fa-solid fa-users"></i>{order.people} personas</span>
                        <span><i className="fa-solid fa-clock"></i>{formatDateTime(order.date_time)}</span>
                    </div>
                    <div className="recipe-hero-actions">
                        {canEditProducts && (
                            <Link to={`/restaurants/${restaurant_id}/orders/${order_id}/products`} className="btn btn-outline-success btn-sm">
                                <i className="fa-solid fa-plus me-1"></i>Añadir productos
                            </Link>
                        )}
                        {isWaiter && order.state === "done" && (
                            <button type="button" className="btn btn-success btn-sm" onClick={() => closeOrder(restaurant_id, order_id)}>
                                <i className="fa-solid fa-circle-check me-1"></i>Cerrar pedido
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="recipe-detail-grid">
                <div className="card recipe-detail-section">
                    <div className="card-body">
                        <div className="product-section-header">
                            <i className="fa-solid fa-utensils"></i>
                            <span>PLATOS</span>
                            <span className="product-section-line"></span>
                        </div>
                        {dishes.length > 0 ? (
                            <div className="product-list">{dishes.map(renderOrderProductRow)}</div>
                        ) : (
                            <p className="text-muted text-center py-3 mb-0">No hay platos en este pedido.</p>
                        )}
                    </div>
                </div>

                <div className="card recipe-detail-section">
                    <div className="card-body">
                        <div className="product-section-header">
                            <i className="fa-solid fa-martini-glass-citrus"></i>
                            <span>BEBIDAS</span>
                            <span className="product-section-line"></span>
                        </div>
                        {drinks.length > 0 ? (
                            <div className="product-list">{drinks.map(renderOrderProductRow)}</div>
                        ) : (
                            <p className="text-muted text-center py-3 mb-0">No hay bebidas en este pedido.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="card order-total-card">
                <div className="card-body order-total-row">
                    <span>Total del pedido</span>
                    <span className="order-total-amount">{formatPrice(total)}</span>
                </div>
            </div>
        </div>
    )
}

export default RestaurantSingleOrder
