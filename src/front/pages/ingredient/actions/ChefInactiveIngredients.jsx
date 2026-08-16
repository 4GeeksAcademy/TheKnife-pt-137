import React, { useEffect, useState } from "react";
import { useIngredient } from "../../../hooks/useIngredient";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent";

const ChefInactiveIngredients = () => {

    const { fetchInactiveIngredients } = useIngredient()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchInactiveIngredients().finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const ingredientList = store.inactiveIngredients.map((ingredient) => {
        const menuId = `inactive-ingredient-menu-${ingredient.id}`
        return (
            <div className="col" key={ingredient.id}>
                <div className="recipe-card card h-100">
                    <div className="recipe-card-media">
                        {ingredient.img_url ? (
                            <img src={ingredient.img_url} className="recipe-card-img recipe-card-img-inactive" alt={ingredient.name} />
                        ) : (
                            <div className="recipe-card-img recipe-card-img-placeholder">
                                <i className="fa-solid fa-carrot"></i>
                            </div>
                        )}
                        <div className="dropdown recipe-card-menu-overlay">
                            <button id={menuId} type="button" className="recipe-menu-btn" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-ellipsis"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end recipe-menu" aria-labelledby={menuId}>
                                <li>
                                    <Link className="dropdown-item" to={`/chef_ingredients/edit/${ingredient.id}`}>
                                        <i className="fa-solid fa-pen me-2"></i>Editar ingrediente
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="d-flex align-items-center gap-2">
                            <h2 className="recipe-card-title mb-0">{ingredient.name}</h2>
                            <span className="product-badge order-badge-pending">Inactivo</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="ingredients_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Ingredientes inactivos</h1>
                <Link to="/chef_ingredients" className="btn btn-outline-primary">Ver activos</Link>
            </div>
            {store.inactiveIngredients.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {ingredientList}
                </div>
            ) : (
                <div className="card">
                    <p className="text-muted text-center py-4 mb-0">No hay ingredientes inactivos.</p>
                </div>
            )}
        </div>
    )
}

export default ChefInactiveIngredients;
