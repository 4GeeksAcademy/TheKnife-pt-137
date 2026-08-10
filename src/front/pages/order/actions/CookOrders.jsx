import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../../hooks/useOrder";

const CookOrders = () => {

    const { getAllRestaurantOrders, updateOrderStatus } = useOrder()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantOrders(restaurant_id).finally(()=>setLoading(false))
    }, [])

    if (loading) return <p className="text-center">Loading...</p>

    const ordersList = store.orders.map((order) => {
        return (
            <div key={order.id} className="col-md-4">
                <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                        <h2 className="h5">Order #{order.id}</h2>
                        <ul className="list-group list-group-flush mb-3">
                            <li className="list-group-item"><strong>Table:</strong> {order.table_id}</li>
                            <li className="list-group-item"><strong>State:</strong> {order.state}</li>
                            <li className="list-group-item"><strong>People:</strong> {order.people}</li>
                        </ul>
                        <div className="d-flex gap-2 mt-auto">
                            <Link to={`/restaurants/${restaurant_id}/orders/${order.id}`}><button className="btn btn-primary btn-sm">View order</button></Link>
                            {order.state === "pending" &&
                                <button className="btn btn-warning btn-sm" onClick={() => updateOrderStatus(restaurant_id, order.id, "doing")}>Start cooking</button>
                            }
                            {order.state === "doing" &&
                                <button className="btn btn-success btn-sm" onClick={() => updateOrderStatus(restaurant_id, order.id, "done")}>Mark as done</button>
                            }
                            {order.state === "done" &&
                                <span className="text-muted">Waiting for waiter</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="order_page container py-4">
            <h1 className="h4 mb-3">Orders</h1>
            <div className="orders row g-3">
                {ordersList}
            </div>
            <Link to="/cook_dashboard" className="d-inline-block mt-3">Back to dashboard</Link>
        </div>
    )
}

export default CookOrders;
