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
        <div className="single_chef">
            <h1>name: {store.singleChef.name}</h1>
            <h2>email: {store.singleChef.email}</h2>
            <h2>restaurant id: {store.singleChef.restaurant_id}</h2>
            <Link to="/chefs">Back to chefs</Link>
        </div>
    )
}

export default SingleChef;