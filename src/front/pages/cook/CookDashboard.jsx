import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import { useCook } from "../../hooks/useCook";


const CookDashBoard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { cookLogout, rehydrateCook } = useCook()

    useEffect(() => {
        const cookLogged = !!localStorage.getItem("cooktoken")
        if (!cookLogged) {
            navigate("/cook_login")
        } else if (!store.loggedCook.cook.id) {
            rehydrateCook()
        }
    }, [])

    const currentCook = store.loggedCook.cook

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Welcome back, {currentCook.name}</h1>
                    <h2 className="h5 text-muted mb-0">Restaurant: {currentCook.restaurant_name}</h2>
                </div>
                <button onClick={cookLogout} className="btn btn-primary">Log out</button>
            </div>

            <div className="card">
                <div className="card-header">Actions</div>
                <div className="card-body d-flex gap-2">
                    <Link to={`/restaurants/${currentCook.restaurant_id}/cook_recipes`} className="btn btn-danger">Recipes list</Link>
                    <Link to={`/restaurants/${currentCook.restaurant_id}/cook_orders`} className="btn btn-success">Orders list</Link>
                    <Link to="/cook_ingredients" className="btn btn-outline-primary">Ingredients</Link>
                </div>
            </div>

        </div>
    )
}

export default CookDashBoard;