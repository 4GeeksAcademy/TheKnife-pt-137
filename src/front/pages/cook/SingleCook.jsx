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
        <div className="single_cook">
            <h1>name: {store.singleCook.name}</h1>
            <h2>email: {store.singleCook.email}</h2>
            <Link to="/cooks">Back to cooks</Link>
        </div>
    )
}

export default SingleCook;