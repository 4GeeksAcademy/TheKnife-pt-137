import React, { useEffect, useState } from "react";
import { useProduct } from "../../../hooks/useProduct";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent";

const ChefRestaurantProducts = () => {

    const { getAllRestaurantProducts, deleteRestaurantProduct } = useProduct()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantProducts(restaurant_id).finally(()=>setLoading(false))
    }, [])

    const dishes = store.products.filter((product) => product.type === "dish")
    const drinks = store.products.filter((product) => product.type === "drink")

    const renderProduct = (product) => (
        <li key={product.id} className="list-group-item d-flex align-items-center gap-3">
            <img src={product.img_url} width="56" height="56" className="rounded" style={{ objectFit: "cover", flex: "none" }} />
            <div className="flex-grow-1">
                <div className="fw-semibold">{product.name}</div>
                <div className="text-muted small">{product.description}</div>
            </div>
            <div className="fw-semibold text-nowrap">{product.sell_price}€</div>
            <div className="d-flex gap-2">
                <Link to={`/restaurants/${restaurant_id}/single_product/${product.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                <Link to={`/restaurants/${restaurant_id}/edit_product/${product.id}`} className="btn btn-sm btn-outline-warning">Edit</Link>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRestaurantProduct(restaurant_id, product.id)}>Delete</button>
            </div>
        </li>
    )

    if (loading) return <LoadingComponent />

    return (
        <div className="product_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Productos</h1>
                <Link to={`/restaurants/${restaurant_id}/create_product`} className="btn btn-primary">Añadir producto</Link>
            </div>
            <div className="products row g-3">
                <div className="col-md-6">
                    <div className="card h-100 overflow-hidden">
                        <div className="card-header">Dishes</div>
                        <div className="card-body p-0">
                            {dishes.length > 0 ? (
                                <ul className="list-group list-group-flush">{dishes.map(renderProduct)}</ul>
                            ) : (
                                <p className="text-muted text-center py-4 mb-0">No hay platos.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100 overflow-hidden">
                        <div className="card-header">Drinks</div>
                        <div className="card-body p-0">
                            {drinks.length > 0 ? (
                                <ul className="list-group list-group-flush">{drinks.map(renderProduct)}</ul>
                            ) : (
                                <p className="text-muted text-center py-4 mb-0">No hay bebidas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChefRestaurantProducts;