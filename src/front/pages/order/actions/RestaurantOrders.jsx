import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../../hooks/useOrder";

const OPEN_STATES = "pending,doing,done"

const RestaurantOrders = () => {

    const { getAllRestaurantOrders } = useOrder()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [showClosed, setShowClosed] = useState(false)

    useEffect(() => {
        getAllRestaurantOrders(restaurant_id, showClosed ? "closed" : OPEN_STATES)
    }, [showClosed])

    const ordersList = store.orders.map((order) => {
        return (
            <div key={order.id} className="col-md-4">
                <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                        <h2 className="h5">Order #{order.id}</h2>
                        <ul className="list-group list-group-flush mb-3">
                            <li className="list-group-item"><strong>Table:</strong> {order.table_id}</li>
                            <li className="list-group-item"><strong>Waiter:</strong> {order.waiter_id}</li>
                            <li className="list-group-item"><strong>State:</strong> {order.state}</li>
                            <li className="list-group-item"><strong>Date and time:</strong> {order.date_time}</li>
                            <li className="list-group-item"><strong>People:</strong> {order.people}</li>
                        </ul>
                        <div className="d-flex gap-2 mt-auto">
                            <Link to={`/restaurants/${restaurant_id}/orders/${order.id}`}><button className="btn btn-primary btn-sm">View order</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="order_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Pedidos</h1>
                <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowClosed(!showClosed)}
                >
                    {showClosed ? "Show open orders" : "Show closed orders"}
                </button>
            </div>
            {store.orders.length > 0 ? (
                <div className="orders row g-3">
                    {ordersList}
                </div>
            ) : (
                <div className="card">
                    <p className="text-muted text-center py-4 mb-0">No hay pedidos que mostrar.</p>
                </div>
            )}
        </div>
    )
}

export default RestaurantOrders;