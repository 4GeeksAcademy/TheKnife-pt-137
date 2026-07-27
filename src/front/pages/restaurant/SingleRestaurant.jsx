import { useEffect } from "react"
import { useRestaurant } from "../../hooks/useRestaurant"
import { useParams } from "react-router-dom"
import storeReducer from "../../store"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"


const SingleRestaurant = () => {

    const { store } = useGlobalReducer()
    const { getSingleRestaurant } = useRestaurant()
    const { restaurant_id } = useParams()

    useEffect(() => {
        getSingleRestaurant(restaurant_id)
    }, [store.SingleRestaurant])

    return (
        <div className="single_restaurant">
            <h1>name: {store.singleRestaurant.name}</h1>
            <h2>email: {store.singleRestaurant.email}</h2>
            <h2>phone: {store.singleRestaurant.phone}</h2>
            <h2>address: {store.singleRestaurant.address}</h2>
            <Link to="/restaurants">Back to restaurants</Link>
        </div>
    )
}

export default SingleRestaurant;