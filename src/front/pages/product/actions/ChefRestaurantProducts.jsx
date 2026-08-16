import React, { useEffect, useState } from "react";
import { useProduct } from "../../../hooks/useProduct";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent";

const formatPrice = (price) =>
    `${Number(price).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`

const ChefRestaurantProducts = () => {

    const { getAllRestaurantProducts, deleteRestaurantProduct } = useProduct()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState("")

    useEffect(() => {
        setLoading(true)
        getAllRestaurantProducts(restaurant_id).finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const term = search.trim().toLowerCase()
    const matchesSearch = (product) => !term || product.name.toLowerCase().includes(term)

    const dishes = store.products.filter((product) => product.type === "dish" && matchesSearch(product))
    const drinks = store.products.filter((product) => product.type === "drink" && matchesSearch(product))

    const showDishes = filter !== "drink"
    const showDrinks = filter !== "dish"

    const renderProduct = (product, badgeClass, badgeLabel) => {
        const menuId = `product-menu-${product.id}`
        return (
            <div className="product-row" key={product.id}>
                {product.img_url ? (
                    <img src={product.img_url} className="product-row-img" alt={product.name} />
                ) : (
                    <div className="product-row-img product-row-img-placeholder">
                        <i className="fa-solid fa-utensils"></i>
                    </div>
                )}
                <div className="product-row-info">
                    <div className="product-row-title">
                        <span className="product-row-name">{product.name}</span>
                        <span className={`product-badge ${badgeClass}`}>{badgeLabel}</span>
                    </div>
                    {product.description && <p className="product-row-desc">{product.description}</p>}
                    {product.ingredients_count != null && (
                        <div className="product-row-ingredients">
                            <i className="fa-solid fa-basket-shopping"></i>{product.ingredients_count} ingredientes
                        </div>
                    )}
                </div>
                <div className="product-row-price">{formatPrice(product.sell_price)}</div>
                <div className="dropdown">
                    <button id={menuId} type="button" className="recipe-menu-btn recipe-menu-btn-inline" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={menuId}>
                        <li>
                            <Link className="dropdown-item" to={`/restaurants/${restaurant_id}/edit_product/${product.id}`}>
                                <i className="fa-solid fa-pen me-2"></i>Editar producto
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to={`/restaurants/${restaurant_id}/single_product/${product.id}`}>
                                <i className="fa-solid fa-eye me-2"></i>Ver información
                            </Link>
                        </li>
                        <li>
                            <button type="button" className="dropdown-item text-danger" onClick={() => deleteRestaurantProduct(restaurant_id, product.id)}>
                                <i className="fa-solid fa-trash-can me-2"></i>Eliminar producto
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className="product_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Productos</h1>
                <Link to={`/restaurants/${restaurant_id}/create_product`} className="btn btn-primary">Añadir producto</Link>
            </div>

            <div className="product-toolbar">
                <div className="product-filter-tabs">
                    <button type="button" className={`product-filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Todos</button>
                    <button type="button" className={`product-filter-btn ${filter === "dish" ? "active" : ""}`} onClick={() => setFilter("dish")}>Platos</button>
                    <button type="button" className={`product-filter-btn ${filter === "drink" ? "active" : ""}`} onClick={() => setFilter("drink")}>Bebidas</button>
                </div>
                <div className="product-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    {showDishes && (
                        <div className="product-section">
                            <div className="product-section-header">
                                <i className="fa-solid fa-utensils"></i>
                                <span>PLATOS</span>
                                <span className="product-section-line"></span>
                            </div>
                            {dishes.length > 0 ? (
                                <div className="product-list">
                                    {dishes.map((dish) => renderProduct(dish, "product-badge-dish", "Plato"))}
                                </div>
                            ) : (
                                <p className="text-muted text-center py-3 mb-0">No hay platos.</p>
                            )}
                        </div>
                    )}

                    {showDrinks && (
                        <div className="product-section">
                            <div className="product-section-header">
                                <i className="fa-solid fa-martini-glass-citrus"></i>
                                <span>BEBIDAS</span>
                                <span className="product-section-line"></span>
                            </div>
                            {drinks.length > 0 ? (
                                <div className="product-list">
                                    {drinks.map((drink) => renderProduct(drink, "product-badge-drink", "Bebida"))}
                                </div>
                            ) : (
                                <p className="text-muted text-center py-3 mb-0">No hay bebidas.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChefRestaurantProducts;
