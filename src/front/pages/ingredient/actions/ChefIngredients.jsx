import React, { useEffect, useState } from "react";
import { useIngredient } from "../../../hooks/useIngredient";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent";

const ChefIngredients = () => {

    const { fetchActiveIngredients, deactivateIngredient } = useIngredient()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        setLoading(true)
        fetchActiveIngredients().finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const term = search.trim().toLowerCase()
    const ingredients = store.ingredients.filter((ingredient) => !term || ingredient.name.toLowerCase().includes(term))

    const ingredientList = ingredients.map((ingredient) => {
        const menuId = `ingredient-menu-${ingredient.id}`
        return (
            <div className="col" key={ingredient.id}>
                <div className="recipe-card card h-100">
                    <div className="recipe-card-media">
                        {ingredient.img_url ? (
                            <img src={ingredient.img_url} className="recipe-card-img" alt={ingredient.name} />
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
                                <li>
                                    <button type="button" className="dropdown-item text-danger" onClick={() => deactivateIngredient(ingredient.id)}>
                                        <i className="fa-solid fa-ban me-2"></i>Desactivar ingrediente
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="card-body">
                        <h2 className="recipe-card-title mb-0">{ingredient.name}</h2>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="ingredients_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Ingredientes</h1>
                <div className="d-flex gap-2">
                    <Link to="/chef_ingredients/inactive" className="btn btn-outline-primary">Inactivos</Link>
                    <Link to="/chef_ingredients/create" className="btn btn-primary">Añadir ingrediente</Link>
                </div>
            </div>

            <div className="product-toolbar justify-content-end">
                <div className="product-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar ingrediente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {ingredients.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {ingredientList}
                </div>
            ) : (
                <div className="card">
                    <p className="text-muted text-center py-4 mb-0">No hay ingredientes activos.</p>
                </div>
            )}
        </div>
    )
}

export default ChefIngredients;
