import React, { useEffect, useState } from "react"
import { useRecipe } from "../../hooks/useRecipe"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { Link } from "react-router-dom"

const Recipes = () => {

    const { getRecipes, deleteRecipe } = useRecipe()

    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getRecipes().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const recipeList = store.recipes.map((recipe) => {
        return <tr key={recipe.id}>
            <td><img src={recipe.img_url} height="50" width="50" style={{ objectFit: "cover" }} /></td>
            <td>{recipe.name}</td>
            <td>{recipe.steps}</td>
            <td>{recipe.restaurant_name}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteRecipe(recipe.id)}>Delete</button>
                <Link to={`/edit_recipe/${recipe.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/recipe/${recipe.id}`}><button className="btn btn-secondary btn-sm">View</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="recipes_page container py-4">
            <Link to="/create_recipe"><button className="btn btn-primary mb-4">Add recipe</button></Link>
            <h1 className="h4 mb-3">Recipes</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Pasos</th>
                        <th>Restaurant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {recipeList}
                </tbody>
            </table>
        </div>
    )
}

export default Recipes
