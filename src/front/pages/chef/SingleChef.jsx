import { useEffect } from "react"
import { useChef } from "../../hooks/useChef"
import { useParams } from "react-router-dom"
import storeReducer from "../../store"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"


const SingleChef = () => {

    const { store } = useGlobalReducer()
    const { getSingleChef } = useChef()
    const { chef_id } = useParams()

    useEffect(() => {
        getSingleChef(chef_id)
    }, [store.singleChef])

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <div className="card-body">
                    <h1 className="h4">{store.singleChef.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Email:</strong> {store.singleChef.email}</li>
                        <li className="list-group-item"><strong>Restaurant ID:</strong> {store.singleChef.restaurant_id}</li>
                    </ul>
                    <Link to="/chefs" className="btn btn-outline-secondary">Back to chefs</Link>
                </div>
            </div>

        </div>
    )
}

export default SingleChef;