import { useEffect, useState } from "react"
import { useOrder } from "../../../hooks/useOrder"
import { useOrderProduct } from "../../../hooks/useOrderProduct"
import { useParams, useNavigate } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const RestaurantSingleOrder = () => {

    const { store } = useGlobalReducer()
    const { getSingleRestaurantOrder } = useOrder()
    const { getProductsOfAnOrder } = useOrderProduct()
    const { restaurant_id, order_id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getSingleRestaurantOrder(restaurant_id, order_id),
            getProductsOfAnOrder(order_id)
        ]).finally(() => setLoading(false))
    }, [restaurant_id, order_id])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const dishes = store.orderProducts.filter((orderProduct) => orderProduct.product_type === "dish")
    const drinks = store.orderProducts.filter((orderProduct) => orderProduct.product_type === "drink")

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
                    <div className="row mb-3">
                        <div className="col-6">
                            <h2 className="h6">Dishes</h2>
                            <ul className="list-group list-group-flush">
                                {dishes.length > 0 ? dishes.map((orderProduct) => (
                                    <li key={orderProduct.id} className="list-group-item">
                                        {orderProduct.product_name} — {orderProduct.amount}
                                    </li>
                                )) : <li className="list-group-item text-muted">No dishes</li>}
                            </ul>
                        </div>
                        <div className="col-6">
                            <h2 className="h6">Drinks</h2>
                            <ul className="list-group list-group-flush">
                                {drinks.length > 0 ? drinks.map((orderProduct) => (
                                    <li key={orderProduct.id} className="list-group-item">
                                        {orderProduct.product_name} — {orderProduct.amount}
                                    </li>
                                )) : <li className="list-group-item text-muted">No drinks</li>}
                            </ul>
                        </div>
                    </div>
                    <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">Back to orders</button>
                </div>
            </div>

        </div>
    )
}

export default RestaurantSingleOrder;
