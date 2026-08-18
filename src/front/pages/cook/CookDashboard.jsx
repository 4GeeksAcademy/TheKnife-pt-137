import { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useCook } from "../../hooks/useCook";
import { useRecipe } from "../../hooks/useRecipe";
import { useOrder } from "../../hooks/useOrder";
import { useIngredient } from "../../hooks/useIngredient";
import LoadingComponent from "../../components/LoadingComponent";

const OPEN_ORDER_STATES = "pending,doing,done"

// Overview shown in the central area of the cook dashboard (/cook_dashboard).
const CookDashboard = () => {

    const { store } = useGlobalReducer()
    const { rehydrateCook } = useCook()
    const { getAllRestaurantRecipes } = useRecipe()
    const { getAllRestaurantOrders } = useOrder()
    const { fetchCookActiveIngredients } = useIngredient()

    const [loadingStats, setLoadingStats] = useState(true)

    useEffect(() => {
        if (!store.loggedCook.cook.id) {
            rehydrateCook()
        }
    }, [])

    const currentCook = store.loggedCook.cook
    const restaurantId = currentCook.restaurant_id

    useEffect(() => {
        if (!restaurantId) {
            setLoadingStats(false)
            return
        }
        setLoadingStats(true)
        Promise.allSettled([
            getAllRestaurantRecipes(restaurantId),
            getAllRestaurantOrders(restaurantId, OPEN_ORDER_STATES),
            fetchCookActiveIngredients(),
        ]).finally(() => setLoadingStats(false))
    }, [restaurantId])

    const stats = [
        { label: "Recetas", value: store.recipes.length, icon: "fa-book-open", to: `/restaurants/${restaurantId}/cook_recipes` },
        { label: "Pedidos abiertos", value: store.orders.length, icon: "fa-receipt", to: `/restaurants/${restaurantId}/cook_orders` },
        { label: "Ingredientes", value: store.ingredients.length, icon: "fa-carrot", to: "/cook_ingredients" },
    ]

    return (
        <div className="cook-overview">

            <div className="mb-4 d-flex align-items-center gap-3">
                {currentCook.img_url ? (
                    <img src={currentCook.img_url} alt={currentCook.name} className="waiter-avatar" />
                ) : (
                    <div className="waiter-avatar">{currentCook.name?.charAt(0).toUpperCase()}</div>
                )}
                <div>
                    <h1 className="h3 mb-1">Bienvenido, {currentCook.name}</h1>
                    {currentCook.restaurant_name && <p className="text-muted mb-0">{currentCook.restaurant_name}</p>}
                </div>
            </div>

            {loadingStats ? (
                <LoadingComponent />
            ) : (
                <div className="row row-cols-2 row-cols-md-3 g-3 mb-4">
                    {stats.map((stat) => (
                        <div className="col" key={stat.label}>
                            <Link to={stat.to} className="text-decoration-none">
                                <div className="card cook-stat-card h-100">
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div className="cook-stat-icon">
                                            <i className={`fa-solid ${stat.icon}`}></i>
                                        </div>
                                        <div>
                                            <div className="cook-stat-value">{stat.value}</div>
                                            <div className="cook-stat-label">{stat.label}</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default CookDashboard;
