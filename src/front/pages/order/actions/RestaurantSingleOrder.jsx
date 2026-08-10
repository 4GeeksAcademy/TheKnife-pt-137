import { useEffect, useState } from "react"
import { useOrder } from "../../../hooks/useOrder"
import { useOrderProduct } from "../../../hooks/useOrderProduct"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const RestaurantSingleOrder = () => {

    const { store } = useGlobalReducer()
    const { getSingleRestaurantOrder, closeOrder } = useOrder()
    const { getProductsOfAnOrder, editOrderProduct, deleteOrderProduct } = useOrderProduct()
    const { restaurant_id, order_id } = useParams()
    const [loading, setLoading] = useState(true)
    const isWaiter = !!localStorage.getItem("waitertoken")

    const canEditProducts = isWaiter && store.singleOrder.state !== "closed"

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getSingleRestaurantOrder(restaurant_id, order_id),
            getProductsOfAnOrder(order_id)
        ]).finally(() => setLoading(false))
    }, [restaurant_id, order_id])

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

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const dishes = store.orderProducts.filter((orderProduct) => orderProduct.product_type === "dish")
    const drinks = store.orderProducts.filter((orderProduct) => orderProduct.product_type === "drink")

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="card-body">
                    <h1 className="h4">Order #{store.singleOrder.id}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Table:</strong> {store.singleOrder.table_id}</li>
                        <li className="list-group-item"><strong>Waiter:</strong> {store.singleOrder.waiter_id}</li>
                        <li className="list-group-item"><strong>State:</strong> {store.singleOrder.state}</li>
                        <li className="list-group-item"><strong>Date and time:</strong> {store.singleOrder.date_time}</li>
                        <li className="list-group-item"><strong>People:</strong> {store.singleOrder.people}</li>
                    </ul>
                    <div className="row mb-3">
                        <div className="col-6">
                            <h2 className="h6">Dishes</h2>
                            <ul className="list-group list-group-flush">
                                {dishes.length > 0 ? dishes.map((orderProduct) => (
                                    <li key={orderProduct.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>{orderProduct.product_name} — {orderProduct.amount}</span>
                                        {canEditProducts && (
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleChangeAmount(orderProduct, -1)}>-</button>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleChangeAmount(orderProduct, 1)}>+</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteOrderProduct(orderProduct.id, order_id)}>Remove</button>
                                            </div>
                                        )}
                                    </li>
                                )) : <li className="list-group-item text-muted">No dishes</li>}
                            </ul>
                        </div>
                        <div className="col-6">
                            <h2 className="h6">Drinks</h2>
                            <ul className="list-group list-group-flush">
                                {drinks.length > 0 ? drinks.map((orderProduct) => (
                                    <li key={orderProduct.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>{orderProduct.product_name} — {orderProduct.amount}</span>
                                        {canEditProducts && (
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleChangeAmount(orderProduct, -1)}>-</button>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleChangeAmount(orderProduct, 1)}>+</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteOrderProduct(orderProduct.id, order_id)}>Remove</button>
                                            </div>
                                        )}
                                    </li>
                                )) : <li className="list-group-item text-muted">No drinks</li>}
                            </ul>
                        </div>
                    </div>

                    {canEditProducts && (
                        <Link to={`/restaurants/${restaurant_id}/orders/${order_id}/products`} className="btn btn-success w-100 mb-2">Add products to order</Link>
                    )}

                    {isWaiter && store.singleOrder.state === "done" && (
                        <button
                            className="btn btn-success w-100 mb-2"
                            onClick={() => closeOrder(restaurant_id, order_id)}
                        >
                            Close order
                        </button>
                    )}

                    {isWaiter ? (
                        <Link to="/waiter_dashboard" className="btn btn-outline-secondary">Back to dashboard</Link>
                    ) : (
                        <Link to={`/restaurants/${restaurant_id}/orders`} className="btn btn-outline-secondary">Back to orders</Link>
                    )}
                </div>
            </div>

        </div>
    )
}

export default RestaurantSingleOrder;
