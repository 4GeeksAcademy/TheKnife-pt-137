import { useEffect } from "react"
import { useRestaurant } from "../../../hooks/useRestaurant"
import { Link, useParams } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import LoadingComponent from "../../../components/LoadingComponent"

const ChefGetRestaurant = () => {

    const { store } = useGlobalReducer()
    const { chefGetRestaurant } = useRestaurant()
    const { restaurant_id } = useParams()

    useEffect(() => {
        chefGetRestaurant(restaurant_id)
    }, [restaurant_id])

    if (!store.singleRestaurant.id) return <LoadingComponent />

    const restaurant = store.singleRestaurant

    return (
        <div className="restaurant_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Mi restaurante</h1>
            </div>

            <div className="recipe-hero card">
                {restaurant.img_url ? (
                    <img src={restaurant.img_url} className="recipe-hero-img" alt={restaurant.name} />
                ) : (
                    <div className="recipe-hero-img recipe-card-img-placeholder">
                        <i className="fa-solid fa-store"></i>
                    </div>
                )}
                <div className="recipe-hero-body">
                    <h2 className="recipe-hero-title">{restaurant.name}</h2>
                    <div className="recipe-divider">
                        <span className="recipe-divider-line"></span>
                        <i className="fa-solid fa-store recipe-divider-icon"></i>
                        <span className="recipe-divider-line"></span>
                    </div>

                    {restaurant.food_type && (
                        <span className="food-type-badge">{restaurant.food_type}</span>
                    )}

                    {restaurant.tags.length > 0 && (
                        <div className="restaurant-tags">
                            {restaurant.tags.map((tag) => (
                                <span key={tag.id} className="tag-pill">
                                    <i className="fa-solid fa-tag"></i>{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="restaurant-contact-list">
                        <span><i className="fa-solid fa-envelope"></i>{restaurant.email}</span>
                        <span><i className="fa-solid fa-phone"></i>{restaurant.phone}</span>
                        <span><i className="fa-solid fa-location-dot"></i>{restaurant.address}</span>
                    </div>

                    {restaurant.description && (
                        <p className="restaurant-description">{restaurant.description}</p>
                    )}

                    <div className="recipe-hero-actions">
                        <Link to={`/restaurants/${restaurant_id}/edit_restaurant`} className="btn btn-outline-success btn-sm">
                            <i className="fa-solid fa-pen me-1"></i>Editar restaurante
                        </Link>
                        <Link to={`/maps/${restaurant_id}`} className="btn btn-outline-secondary btn-sm">
                            <i className="fa-solid fa-map me-1"></i>Ver ubicación
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChefGetRestaurant;
