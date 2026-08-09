import { useEffect, useState } from "react"
import { useOrder } from "../../../hooks/useOrder"
import { useOrderProduct } from "../../../hooks/useOrderProduct"
import { useProduct } from "../../../hooks/useProduct"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const RestaurantSingleOrder = () => {

    const { store } = useGlobalReducer()
    const { getSingleRestaurantOrder, closeOrder } = useOrder()
    const { getProductsOfAnOrder, createOrderProduct, editOrderProduct, deleteOrderProduct } = useOrderProduct()
    const { getAllRestaurantProducts } = useProduct()
    const { restaurant_id, order_id } = useParams()
    const [loading, setLoading] = useState(true)
    const isWaiter = !!localStorage.getItem("waitertoken")
    const [newProduct, setNewProduct] = useState({ product_id: "", amount: 1 })

    const canEditProducts = isWaiter && store.singleOrder.state !== "closed"

    useEffect(() => {
        setLoading(true)
        const promises = [
            getSingleRestaurantOrder(restaurant_id, order_id),
            getProductsOfAnOrder(order_id)
        ]
        if (isWaiter) promises.push(getAllRestaurantProducts(restaurant_id))
        Promise.all(promises).finally(() => setLoading(false))
    }, [restaurant_id, order_id])

    function handleAddProduct(e) {
        e.preventDefault()
        if (!newProduct.product_id) return
        createOrderProduct({
            order_id,
            product_id: newProduct.product_id,
            amount: newProduct.amount
        })
        setNewProduct({ product_id: "", amount: 1 })
    }

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
                        ))}
                    </ul>

                    {canEditProducts && (
                        <form className="d-flex gap-2 mb-3" onSubmit={handleAddProduct}>
                            <select
                                className="form-select"
                                required
                                value={newProduct.product_id}
                                onChange={(e) => setNewProduct({ ...newProduct, product_id: e.target.value })}
                            >
                                <option value="">Select a product</option>
                                {store.products.map((product) => (
                                    <option value={product.id} key={product.id}>{product.name}</option>
                                ))}
                            </select>
                            <input
                                className="form-control"
                                type="number"
                                min="1"
                                style={{ maxWidth: "80px" }}
                                value={newProduct.amount}
                                onChange={(e) => setNewProduct({ ...newProduct, amount: Number(e.target.value) })}
                            />
                            <button className="btn btn-primary" type="submit">Add</button>
                        </form>
                    )}

                    {isWaiter && store.singleOrder.state === "done" && (
                        <button
                            className="btn btn-success w-100 mb-2"
                            onClick={() => closeOrder(restaurant_id, order_id)}
                        >
                            Close order
                        </button>
                    )}

                    <Link to={`/restaurants/${restaurant_id}/${isWaiter ? "waiter_orders" : "orders"}`} className="btn btn-outline-secondary">Back to orders</Link>
                </div>
            </div>

        </div>
    )
}

export default RestaurantSingleOrder;