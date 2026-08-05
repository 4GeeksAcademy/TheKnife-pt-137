import React, { useEffect } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../../hooks/useOrder";

const RestaurantOrders = () => {

    const { getAllRestaurantOrders } = useOrder()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()

    useEffect(() => {
        getAllRestaurantOrders(restaurant_id)
    }, [])

    const ordersList = store.orders.map((order) => {
        return <div key={order.id} className="order d-flex align-items-center gap-3">
            <span>table id: {order.table_id}</span>
            <span>waiter id: {order.waiter_id}</span>
            <span>state: {order.state}</span>
            <span>date and time: {order.date_time}</span>
            <span>people: {order.people}</span>
            <Link to={`/restaurants/${restaurant_id}/orders/${order.id}`}><button className="btn btn-primary">View order</button></Link>
        </div>
    })

    return (
        <div className="order_page d-flex flex-column align-items-center gap-3 mt-4">
            <div className="orders d-flex flex-column  align-items-center gap-2">
                <h1>orders</h1>
                {ordersList}
            </div>
            <Link to="/chef_dashboard">Back to dashboard</Link>
        </div>
    )
}

export default RestaurantOrders;