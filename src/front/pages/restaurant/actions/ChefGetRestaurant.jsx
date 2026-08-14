import { useEffect } from "react"
import { useRestaurant } from "../../../hooks/useRestaurant"
import { useParams } from "react-router-dom"
import storeReducer from "../../../store"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import LoadingComponent from "../../../components/LoadingComponent"

const ChefGetRestaurant = () => {

    const { store } = useGlobalReducer()
    const { chefGetRestaurant } = useRestaurant()
    const { restaurant_id } = useParams()

    useEffect(() => {
        chefGetRestaurant(restaurant_id)
    }, [store.singleRestaurant])

    if (!store.singleRestaurant.id) return <LoadingComponent />

    return (
        <div className="d-flex flex-column align-items-center">

            <div className="card w-100" style={{ maxWidth: "500px" }}>
                <img src={store.singleRestaurant.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                <div className="card-body">
                    <h1 className="h4">{store.singleRestaurant.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Email:</strong> {store.singleRestaurant.email}</li>
                        <li className="list-group-item"><strong>Phone:</strong> {store.singleRestaurant.phone}</li>
                        <li className="list-group-item"><strong>Address:</strong> {store.singleRestaurant.address}</li>
                        <li className="list-group-item"><strong>Food type:</strong> {store.singleRestaurant.food_type}</li>
                        <li className="list-group-item"><strong>Description:</strong> {store.singleRestaurant.description}</li>
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default ChefGetRestaurant;