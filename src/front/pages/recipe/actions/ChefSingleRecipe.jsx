import { useEffect, useState } from "react"
import { useRecipe } from "../../../hooks/useRecipe"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const ChefSingleRecipe = () => {

    const { store } = useGlobalReducer()
    const { getOneRestaurantRecipe } = useRecipe()
    const { restaurant_id, recipe_id } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getOneRestaurantRecipe(restaurant_id, recipe_id).finally(() => setLoading(false))
    }, [restaurant_id, recipe_id])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <img src={store.single_recipe.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                <div className="card-body">
                    <h1 className="h4">{store.single_recipe.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Steps:</strong> {store.single_recipe.steps}</li>
                    </ul>
                    <div className="d-flex gap-2">
                        <Link to={`/restaurants/${restaurant_id}/edit_recipe/${recipe_id}`} className="btn btn-warning">Edit recipe</Link>
                        <Link to={`/restaurants/${restaurant_id}/recipes`} className="btn btn-outline-secondary">Back to recipes</Link>
                    </div>
                </div>
            </div>
            <Link to={`/restaurants/${restaurant_id}/recipes`}>
                Volver a recetas
            </Link>

        </div>
    )
}

export default ChefSingleRecipe;
