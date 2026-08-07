import { useEffect } from "react"
import { useOrder } from "../../hooks/useOrder"
import { useParams } from "react-router-dom"
import storeReducer from "../../store"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"
import { useOrderProduct } from "../../hooks/useOrderProduct"


const SingleOrder = () => {

    const { store } = useGlobalReducer()
    const { getSingleOrder, editOrder } = useOrder()
    const { getProductsOfAnOrder, deleteOrderProduct, editOrderProduct } = useOrderProduct()
    const { order_id } = useParams()

    useEffect(() => {
        getProductsOfAnOrder(order_id)
        getSingleOrder(order_id)
    }, [order_id])

    const orderProducts = store.orderProducts.map((orderProduct) => {
        return <li key={orderProduct.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{orderProduct.product_name} — Amount: {orderProduct.amount}</span>
            <button onClick={()=>deleteOrderProduct(orderProduct.id, order_id)} className="btn btn-danger btn-sm">Delete</button>
            </li>
    })

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <div className="card-body">
                    <h1 className="h4">Order #{order_id}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Table:</strong> {store.singleOrder.table_id}</li>
                        <li className="list-group-item"><strong>Waiter:</strong> {store.singleOrder.waiter_id}</li>
                        <li className="list-group-item"><strong>State:</strong> {store.singleOrder.state}</li>
                        <li className="list-group-item"><strong>Date and time:</strong> {store.singleOrder.date_time}</li>
                        <li className="list-group-item"><strong>People:</strong> {store.singleOrder.people}</li>
                    </ul>

                    <h2 className="h6">Products</h2>
                    <ul className="list-group list-group-flush mb-3">
                        {orderProducts}
                    </ul>

                    <div className="d-flex gap-2">
                        <Link to={`/orders/${order_id}/products`}><button className="btn btn-success btn-sm">Add products to order</button></Link>
                        <Link to="/orders" className="btn btn-outline-secondary btn-sm">Back to orders</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SingleOrder;