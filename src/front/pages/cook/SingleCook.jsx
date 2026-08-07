import { useEffect } from "react"
import { useCook } from "../../hooks/useCook"
import { useParams } from "react-router-dom"
import storeReducer from "../../store"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"


const SingleCook = () => {

    const { store } = useGlobalReducer()
    const { getSingleCook } = useCook()
    const { cook_id } = useParams()

    useEffect(() => {
        getSingleCook(cook_id)
    }, [store.singleCook])

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <div className="card-body">
                    <h1 className="h4">{store.singleCook.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Email:</strong> {store.singleCook.email}</li>
                    </ul>
                    <Link to="/cooks" className="btn btn-outline-secondary">Back to cooks</Link>
                </div>
            </div>

        </div>
    )
}

export default SingleCook;