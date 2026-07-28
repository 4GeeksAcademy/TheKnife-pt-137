import { useEffect } from "react"
import { useOrder } from "../../hooks/useOrder"
import { useParams } from "react-router-dom"
import storeReducer from "../../store"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"


const SingleOrder = () => {

    const { store } = useGlobalReducer()
    const { getSingleOrder } = useOrder()
    const { order_id } = useParams()

    useEffect(() => {
        getSingleOrder(order_id)
    }, [store.singleOrder])

    return (
        <div className="single_order">
            <h1>table id: {store.singleOrder.table_id}</h1>
            <h2>waiter id: {store.singleOrder.waiter_id}</h2>
            <h2>state: {store.singleOrder.state}</h2>
            <h2>date time: {store.singleOrder.date_time}</h2>
            <h2>people: {store.singleOrder.people}</h2>
            <Link to="/orders">Back to orders</Link>
        </div>
    )
}

export default SingleOrder;