import React, { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useOrder } from "../../hooks/useOrder";

const Orders = () => {

    const { getOrders, deleteOrder } = useOrder()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getOrders()
    }, [])

    const ordersList = store.orders.map((order) => {
        return <div key={order.id} className="order d-flex align-items-center gap-3">
            <span>table id: {order.table_id}</span>
            <span>waiter id: {order.waiter_id}</span>
            <span>state: {order.state}</span>
            <span>date and time: {order.date_time}</span>
            <span>people: {order.people}</span>
            <button className="btn btn-danger" onClick={() => deleteOrder(order.id)}>Delete order</button>
            <Link to={`/edit_order/${order.id}`}><button className="btn btn-warning">Edit order</button></Link>
            <Link to={`/single_order/${order.id}`}><button className="btn btn-primary">View order</button></Link>
        </div>
    })

    return (
        <div className="order_page d-flex flex-column align-items-center gap-3 mt-4">
            <Link to="/create_order"><button className="btn btn-primary">Add order</button></Link>
            <div className="orders d-flex flex-column  align-items-center gap-2">
                <h1>orders</h1>
                {ordersList}
            </div>
        </div>
    )
}

export default Orders;