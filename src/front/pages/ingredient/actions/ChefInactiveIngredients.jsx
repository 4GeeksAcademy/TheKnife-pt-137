import React, { useEffect } from "react";
import { useIngredient } from "../../../hooks/useIngredient";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const ChefInactiveIngredients = () => {

    const { fetchInactiveIngredients } = useIngredient()
    const { store } = useGlobalReducer()

    useEffect(() => {
        fetchInactiveIngredients()
    }, [])

    const ingredientList = store.inactiveIngredients.map((ingredient) => {
        return (
            <div key={ingredient.id} className="col-md-4">
                <div className="card h-100">
                    <img src={ingredient.img_url} className="card-img-top" height="180" style={{ objectFit: "cover" }} />
                    <div className="card-body d-flex flex-column">
                        <h2 className="h5">{ingredient.name}</h2>
                        <div className="d-flex gap-2 mt-auto">
                            <Link to={`/chef_ingredients/edit/${ingredient.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="ingredients_page container py-4">
            <Link to="/chef_ingredients"><button className="btn btn-outline-secondary mb-4">Back to active ingredients</button></Link>
            <h1 className="h4 mb-3">Inactive ingredients</h1>
            <div className="ingredients row g-3">
                {ingredientList}
            </div>
        </div>
    )
}

export default ChefInactiveIngredients;
