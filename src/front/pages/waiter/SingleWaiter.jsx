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
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                {store.singleWaiter.img_url && (
                    <img src={store.singleWaiter.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                )}
                <div className="card-body">
                    <h1 className="h4">{store.singleWaiter.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Email:</strong> {store.singleWaiter.email}</li>
                    </ul>
                    <Link to="/waiters" className="btn btn-outline-secondary">Back to waiters</Link>
                </div>
            </div>

        </div>
    )
}

export default SingleWaiter;