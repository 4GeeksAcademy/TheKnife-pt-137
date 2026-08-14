import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useOrder } from "../../hooks/useOrder";
import LoadingComponent from "../../components/LoadingComponent";

const Orders = () => {

    const { getOrders, deleteOrder } = useOrder()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getOrders().finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const ordersList = store.orders.map((order) => {
        return <tr key={order.id}>
            <td>{order.table_id}</td>
            <td>{order.waiter_id}</td>
            <td>{order.state}</td>
            <td>{order.date_time}</td>
            <td>{order.people}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteOrder(order.id)}>Delete</button>
                <Link to={`/edit_order/${order.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_order/${order.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="order_page container py-4">
            <Link to="/create_order"><button className="btn btn-primary mb-4">Add order</button></Link>
            <h1 className="h4 mb-3">Orders</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Table ID</th>
                        <th>Waiter ID</th>
                        <th>State</th>
                        <th>Date and time</th>
                        <th>People</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {ordersList}
                </tbody>
            </table>
        </div>
    )
}

export default Orders;