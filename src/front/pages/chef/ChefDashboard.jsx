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

                    <div className="card">
                        <div className="card-header">Restaurante</div>
                        <div className="card-body">
                            {restaurant.id ? (
                                <div className="row g-4 align-items-start">
                                    {restaurant.img_url && (
                                        <div className="col-md-4">
                                            <img src={restaurant.img_url} className="img-fluid rounded" style={{ objectFit: "cover", width: "100%", height: "180px" }} />
                                        </div>
                                    )}
                                    <div className={restaurant.img_url ? "col-md-8" : "col-12"}>
                                        <h2 className="h5 mb-3">{restaurant.name}</h2>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item px-0"><strong>Email:</strong> {restaurant.email}</li>
                                            <li className="list-group-item px-0"><strong>Teléfono:</strong> {restaurant.phone}</li>
                                            <li className="list-group-item px-0"><strong>Dirección:</strong> {restaurant.address}</li>
                                            <li className="list-group-item px-0"><strong>Tipo de cocina:</strong> {restaurant.food_type || "—"}</li>
                                            <li className="list-group-item px-0"><strong>Descripción:</strong> {restaurant.description || "—"}</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted mb-0">No se han podido cargar los datos del restaurante.</p>
                            )}
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}

export default ChefDashboard;
