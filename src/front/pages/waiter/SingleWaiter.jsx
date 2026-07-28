import { useEffect } from "react"
import { useWaiter } from "../../hooks/useWaiter"
import { useParams } from "react-router-dom"
import storeReducer from "../../store"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"


const SingleWaiter = () => {

    const { store } = useGlobalReducer()
    const { getSingleWaiter } = useWaiter()
    const { waiter_id } = useParams()

    useEffect(() => {
        getSingleWaiter(waiter_id)
    }, [store.singleWaiter])

    return (
        <div className="single_waiter">
            <h1>name: {store.singleWaiter.name}</h1>
            <h2>email: {store.singleWaiter.email}</h2>
            <Link to="/waiters">Back to waiters</Link>
        </div>
    )
}

export default SingleWaiter;