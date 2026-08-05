import React, { useEffect } from "react";
import { useIngredient } from "../../../hooks/useIngredient";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const ChefIngredients = () => {

    const { fetchActiveIngredients, deactivateIngredient } = useIngredient()
    const { store } = useGlobalReducer()

    useEffect(() => {
        fetchActiveIngredients()
    }, [])

    const ingredientList = store.ingredients.map((ingredient) => {
        return (
            <div key={ingredient.id} className="col-md-4">
                <div className="card h-100">
                    <img src={ingredient.img_url} className="card-img-top" height="180" style={{ objectFit: "cover" }} />
                    <div className="card-body d-flex flex-column">
                        <h2 className="h5">{ingredient.name}</h2>
                        <div className="d-flex gap-2 mt-auto">
                            <button className="btn btn-danger btn-sm" onClick={() => deactivateIngredient(ingredient.id)}>Deactivate</button>
                            <Link to={`/chef_ingredients/edit/${ingredient.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="ingredients_page container py-4">
            <div className="d-flex gap-2 mb-4">
                <Link to="/chef_ingredients/create"><button className="btn btn-primary">Add ingredient</button></Link>
                <Link to="/chef_ingredients/inactive"><button className="btn btn-outline-secondary">View inactive ingredients</button></Link>
            </div>
            <h1 className="h4 mb-3">Ingredients</h1>
            <div className="ingredients row g-3">
                {ingredientList}
            </div>
            <Link to="/chef_dashboard" className="d-inline-block mt-3">Back to dashboard</Link>
        </div>
    )
}

export default ChefIngredients;
