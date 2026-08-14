import { useEffect, useState } from "react"
import { useProduct } from "../../../hooks/useProduct"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { useParams, Link } from "react-router-dom"
import LoadingComponent from "../../../components/LoadingComponent"

const ClientRestaurantDishes = () => {

    const { store } = useGlobalReducer()
    const { getRestaurantDishes } = useProduct()
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getRestaurantDishes(restaurant_id).finally(() => setLoading(false))
    }, [restaurant_id])

    if (loading) return <LoadingComponent />

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Dishes</h1>

            {store.products.length > 0 ? (
                <div className="row g-3">
                    {store.products.map((dish) => (
                        <div key={dish.id} className="col-md-4">
                            <div className="card h-100">
                                <img src={dish.img_url} className="card-img-top" height="180" style={{ objectFit: "cover" }} />
                                <div className="card-body d-flex flex-column">
                                    <h2 className="h5">{dish.name}</h2>
                                    {dish.description && <p className="card-text text-muted flex-grow-1">{dish.description}</p>}
                                    <p className="card-text fw-bold">{dish.sell_price}€</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted">Este restaurante todavía no tiene platos publicados.</p>
            )}

            <Link to="/restaurants/nearby_search" className="d-inline-block mt-3">Back to search</Link>
        </div>
    )
}

export default ClientRestaurantDishes
