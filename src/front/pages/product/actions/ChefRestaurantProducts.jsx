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

    const dishList = dishes.map((product) => {
        return <div key={product.id} className="product d-flex align-items-center gap-3 border-bottom pb-2 mb-2">
            <span>{product.name}</span>
            <span>{product.description}</span>
            <span>{product.sell_price}€</span>
            <img src={product.img_url} height="80" width="80" />
            <button className="btn btn-danger" onClick={() => deleteRestaurantProduct(restaurant_id, product.id)}>Delete product</button>
            <Link to={`/restaurants/${restaurant_id}/edit_product/${product.id}`}><button className="btn btn-warning">Edit product</button></Link>
            <Link to={`/restaurants/${restaurant_id}/single_product/${product.id}`}><button className="btn btn-primary">View product</button></Link>
        </div>
    })

    const drinkList = drinks.map((product) => {
        return <div key={product.id} className="product d-flex align-items-center gap-3 border-bottom pb-2 mb-2">
            <span>{product.name}</span>
            <span>{product.description}</span>
            <span>{product.sell_price}€</span>
            <img src={product.img_url} height="200" width="250" />
            <button className="btn btn-danger" onClick={() => deleteRestaurantProduct(restaurant_id, product.id)}>Delete product</button>
            <Link to={`/restaurants/${restaurant_id}/edit_product/${product.id}`}><button className="btn btn-warning">Edit product</button></Link>
            <Link to={`/restaurants/${restaurant_id}/single_product/${product.id}`}><button className="btn btn-primary">View product</button></Link>
        </div>
    })

    if (loading) return <LoadingComponent />

    return (
        <div className="product_page container py-4">
            <Link to={`/restaurants/${restaurant_id}/create_product`}><button className="btn btn-primary mb-4">Add product</button></Link>
            <div className="products row">
                <div className="dishes col-md-6 d-flex flex-column gap-2">
                    <h1 className="h4">Dishes</h1>
                    {dishList}
                </div>
                <div className="drinks col-md-6 d-flex flex-column gap-2">
                    <h1 className="h4">Drinks</h1>
                    {drinkList}
                </div>
            </div>
        </div>
    )
}

export default ChefRestaurantProducts;