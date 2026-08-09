import { useEffect, useState } from "react"
import { useOrder } from "../../../hooks/useOrder"
import { useOrderProduct } from "../../../hooks/useOrderProduct"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const RestaurantSingleOrder = () => {

    const { store } = useGlobalReducer()
    const { getSingleRestaurantOrder, closeOrder } = useOrder()
    const { getProductsOfAnOrder } = useOrderProduct()
    const { restaurant_id, order_id } = useParams()
    const [loading, setLoading] = useState(true)
    const isWaiter = !!localStorage.getItem("waitertoken")

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getSingleRestaurantOrder(restaurant_id, order_id),
            getProductsOfAnOrder(order_id)
        ]).finally(() => setLoading(false))
    }, [restaurant_id, order_id])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <div className="card-body">
                    <h1 className="h4">Order #{store.singleOrder.id}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Table:</strong> {store.singleOrder.table_id}</li>
                        <li className="list-group-item"><strong>Waiter:</strong> {store.singleOrder.waiter_id}</li>
                        <li className="list-group-item"><strong>State:</strong> {store.singleOrder.state}</li>
                        <li className="list-group-item"><strong>Date and time:</strong> {store.singleOrder.date_time}</li>
                        <li className="list-group-item"><strong>People:</strong> {store.singleOrder.people}</li>
                    </ul>
                    <h2 className="h6">Products</h2>
                    <ul className="list-group list-group-flush mb-3">
                        {store.orderProducts.map((orderProduct) => (
                            <li key={orderProduct.id} className="list-group-item">
                                {orderProduct.product_name} — {orderProduct.amount}
                            </li>
                        ))}
                    </ul>

                    {isWaiter && store.singleOrder.state === "done" && (
                        <button
                            className="btn btn-success w-100 mb-2"
                            onClick={() => closeOrder(restaurant_id, order_id)}
                        >
                            Close order
                        </button>
                    )}

                    <Link to={`/restaurants/${restaurant_id}/orders`} className="btn btn-outline-secondary">Back to orders</Link>
                </div>
            </div>

        </div>
    )
}

export default RestaurantSingleOrder;