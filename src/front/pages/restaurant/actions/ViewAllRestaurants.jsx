import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useRestaurant } from "../../../hooks/useRestaurant"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import LoadingComponent from "../../../components/LoadingComponent"

const ViewAllRestaurants = () => {

    const { store } = useGlobalReducer()
    const { getAllRestaurantsForClient } = useRestaurant()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantsForClient().finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    return (
        <div className="restaurants_page">
            <div className="client-page-header">
                <h1 className="client-page-title">Todos los restaurantes</h1>
            </div>

            {store.allRestaurants.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {store.allRestaurants.map((restaurant) => (
                        <div className="col" key={restaurant.id}>
                            <div className="recipe-card card h-100">
                                <div className="recipe-card-media">
                                    {restaurant.img_url ? (
                                        <img src={restaurant.img_url} className="recipe-card-img" alt={restaurant.name} />
                                    ) : (
                                        <div className="recipe-card-img recipe-card-img-placeholder">
                                            <i className="fa-solid fa-store"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h2 className="recipe-card-title">{restaurant.name}</h2>
                                    {restaurant.food_type && (
                                        <span className="food-type-badge">{restaurant.food_type}</span>
                                    )}
                                    <div className="restaurant-contact-list">
                                        <span><i className="fa-solid fa-location-dot"></i>{restaurant.address}</span>
                                    </div>
                                    {restaurant.description && (
                                        <p className="restaurant-description restaurant-description-clamp flex-grow-1">{restaurant.description}</p>
                                    )}
                                    <div className="d-flex gap-2 mt-auto">
                                        <Link to={`/restaurants/${restaurant.id}/dishes`} className="btn btn-outline-primary btn-sm">
                                            Ver platos
                                        </Link>
                                        <Link to={`/restaurants/${restaurant.id}/reserve`} className="btn btn-primary btn-sm">
                                            Reservar mesa
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <p className="text-muted text-center py-4 mb-0">No hay restaurantes disponibles.</p>
                </div>
            )}
        </div>
    )
}

export default ViewAllRestaurants
