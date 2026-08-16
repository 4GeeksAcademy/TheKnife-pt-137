import React, { useEffect } from "react";
import { useIngredient } from "../../../hooks/useIngredient";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const CookIngredients = () => {

    const { fetchCookActiveIngredients } = useIngredient()
    const { store } = useGlobalReducer()

    useEffect(() => {
        fetchCookActiveIngredients()
    }, [])

    const ingredientList = store.ingredients.map((ingredient) => {
        return (
            <div key={ingredient.id} className="col-md-4">
                <Link to={`/cook_ingredients/${ingredient.id}`} className="text-decoration-none text-reset">
                    <div className="card h-100">
                        <img src={ingredient.img_url} className="card-img-top" height="180" style={{ objectFit: "cover" }} />
                        <div className="card-body">
                            <h2 className="h5 mb-0">{ingredient.name}</h2>
                        </div>
                    </div>
                </Link>
            </div>
        )
    })

    return (
        <div className="ingredients_page">
            <div className="cook-page-header">
                <h1 className="cook-page-title">Ingredientes</h1>
            </div>
            <div className="ingredients row g-3">
                {ingredientList}
            </div>
        </div>
    )
}

export default CookIngredients;
