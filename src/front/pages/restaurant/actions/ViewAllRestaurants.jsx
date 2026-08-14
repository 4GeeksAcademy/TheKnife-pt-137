import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRestaurant } from "../../../hooks/useRestaurant"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const ViewAllRestaurants = () => {

    const { store } = useGlobalReducer()
    const { getAllRestaurantsForClient } = useRestaurant()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantsForClient().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    return (
        <div className="container py-4">
            <button onClick={() => navigate(-1)} className="btn btn-link d-inline-block mb-3 ps-0">Back</button>

            <h1 className="h4 mb-3">All restaurants</h1>

            {store.allRestaurants.length === 0 ? (
                <p className="text-muted">No hay restaurantes disponibles.</p>
            ) : (
                <div className="row g-3">
                    {store.allRestaurants.map((restaurant) => (
                        <div key={restaurant.id} className="col-md-4">
                            <div className="card h-100">
                                <img
                                    src={restaurant.img_url}
                                    className="card-img-top"
                                    height="140"
                                    style={{ objectFit: "cover" }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h2 className="h6 mb-1">{restaurant.name}</h2>
                                    {restaurant.food_type && (
                                        <span className="badge bg-secondary mb-2 align-self-start">{restaurant.food_type}</span>
                                    )}
                                    <p className="card-text text-muted small mb-1">
                                        <span className="me-1">📍</span>{restaurant.address}
                                    </p>
                                    {restaurant.description && (
                                        <p className="card-text small flex-grow-1">{restaurant.description}</p>
                                    )}
                                    <div className="d-flex gap-2 mt-2">
                                        <Link
                                            to={`/restaurants/${restaurant.id}/dishes`}
                                            className="btn btn-primary btn-sm align-self-start"
                                        >
                                            View dishes
                                        </Link>
                                        <Link
                                            to={`/restaurants/${restaurant.id}/reserve`}
                                            className="btn btn-success btn-sm align-self-start"
                                        >
                                            Book Table
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default ViewAllRestaurants
