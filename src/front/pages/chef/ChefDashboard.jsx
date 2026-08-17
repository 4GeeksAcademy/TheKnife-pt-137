import { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";
import { useWaiter } from "../../hooks/useWaiter";
import { useCook } from "../../hooks/useCook";
import { useRecipe } from "../../hooks/useRecipe";
import { useOrder } from "../../hooks/useOrder";
import { useProduct } from "../../hooks/useProduct";
import LoadingComponent from "../../components/LoadingComponent";

const OPEN_ORDER_STATES = "pending,doing,done"

// Overview shown in the central area of the chef dashboard (/chef_dashboard).
const ChefDashboard = () => {

    const { store } = useGlobalReducer()
    const { chefGetRestaurant } = useRestaurant()
    const { getRestaurantWaiters } = useWaiter()
    const { getRestaurantCooks } = useCook()
    const { getAllRestaurantRecipes } = useRecipe()
    const { getAllRestaurantOrders } = useOrder()
    const { getAllRestaurantProducts } = useProduct()

    const [loadingStats, setLoadingStats] = useState(true)

    const currentChef = store.loggedChef.chef
    const restaurantId = currentChef.restaurant_id

    useEffect(() => {
        if (!restaurantId) {
            setLoadingStats(false)
            return
        }
        setLoadingStats(true)
        Promise.allSettled([
            chefGetRestaurant(restaurantId),
            getRestaurantWaiters(restaurantId),
            getRestaurantCooks(restaurantId),
            getAllRestaurantRecipes(restaurantId),
            getAllRestaurantOrders(restaurantId, OPEN_ORDER_STATES),
            getAllRestaurantProducts(restaurantId),
        ]).finally(() => setLoadingStats(false))
    }, [restaurantId])

    const restaurant = store.singleRestaurant

    const stats = [
        { label: "Camareros", value: store.waiters.length, icon: "fa-user-tie", to: `/restaurants/${restaurantId}/waiters` },
        { label: "Cocineros", value: store.cooks.length, icon: "fa-kitchen-set", to: `/restaurants/${restaurantId}/cooks` },
        { label: "Recetas", value: store.recipes.length, icon: "fa-book-open", to: `/restaurants/${restaurantId}/recipes` },
        { label: "Pedidos abiertos", value: store.orders.length, icon: "fa-receipt", to: `/restaurants/${restaurantId}/orders` },
        { label: "Productos", value: store.products.length, icon: "fa-utensils", to: `/restaurants/${restaurantId}/products` },
    ]

    return (
        <div className="chef-overview">

            <div className="mb-4">
                <h1 className="h3 mb-1">Bienvenido, {currentChef.name}</h1>
                {currentChef.restaurant_name && <p className="text-muted mb-0">{currentChef.restaurant_name}</p>}
            </div>

            {!restaurantId ? (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <h2 className="h5 mb-3">Todavía no tienes un restaurante</h2>
                        <p className="text-muted mb-4">Crea tu restaurante para empezar a gestionar camareros, cocineros, recetas y pedidos.</p>
                        <Link to="/register_restaurant" className="btn btn-chef-brand">Crear restaurante</Link>
                    </div>
                </div>
            ) : loadingStats ? (
                <LoadingComponent />
            ) : (
                <>
                    <div className="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3 mb-4">
                        {stats.map((stat) => (
                            <div className="col" key={stat.label}>
                                <Link to={stat.to} className="text-decoration-none">
                                    <div className="card chef-stat-card h-100">
                                        <div className="card-body d-flex align-items-center gap-3">
                                            <div className="chef-stat-icon">
                                                <i className={`fa-solid ${stat.icon}`}></i>
                                            </div>
                                            <div>
                                                <div className="chef-stat-value">{stat.value}</div>
                                                <div className="chef-stat-label">{stat.label}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {restaurant.id ? (
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

                                {restaurant.tags && restaurant.tags.length > 0 && (
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
                                    <Link to={`/restaurants/${restaurantId}`} className="btn btn-outline-success btn-sm">
                                        <i className="fa-solid fa-circle-info me-1"></i>Ver detalles completos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                <p className="text-muted mb-0">No se han podido cargar los datos del restaurante.</p>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    )
}

export default ChefDashboard;
