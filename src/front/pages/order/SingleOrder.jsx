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
        return <li key={orderProduct.id} className="d-flex gap-2">
            {orderProduct.product_name}
            <span>Amount: {orderProduct.amount}</span>
            <button onClick={()=>deleteOrderProduct(orderProduct.id, order_id)} className="btn btn-danger">Delete</button>
            </li>
    })

    return (
        <div className="single_order">
            <h1>table id: {store.singleOrder.table_id}</h1>
            <h2>waiter id: {store.singleOrder.waiter_id}</h2>
            <h2>state: {store.singleOrder.state}</h2>
            <h2>date time: {store.singleOrder.date_time}</h2>
            <h2>people: {store.singleOrder.people}</h2>
            <h2>Products</h2>
            <ul>
                {orderProducts}
            </ul>
            <Link to={`/orders/${order_id}/products`}><button className="btn btn-success">Add products to order</button></Link>
            <Link to="/orders">Back to orders</Link>
        </div>
    )
}

export default SingleOrder;