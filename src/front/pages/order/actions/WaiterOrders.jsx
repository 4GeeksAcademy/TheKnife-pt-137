import React, { useEffect } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../../hooks/useOrder";

const WaiterOrders = () => {

    const { getAllRestaurantOrders } = useOrder()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()

    useEffect(() => {
        getAllRestaurantOrders(restaurant_id)
    }, [])

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
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="order_page container py-4">
            <h1 className="h4 mb-3">My orders</h1>
            <div className="orders row g-3">
                {ordersList}
            </div>
            <Link to="/waiter_dashboard" className="d-inline-block mt-3">Back to dashboard</Link>
        </div>
    )
}

export default WaiterOrders;