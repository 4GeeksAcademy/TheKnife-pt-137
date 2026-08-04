import React, { useEffect } from "react";
import { useProduct } from "../../../hooks/useProduct";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";

const RestaurantProducts = () => {

    const { getAllRestaurantProducts, deleteRestaurantProduct } = useProduct()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()

    useEffect(() => {
        getAllRestaurantProducts(restaurant_id)
    }, [])

    const dishes = store.products.filter((product) => product.type === "dish")
    const drinks = store.products.filter((product) => product.type === "drink")

    const dishList = dishes.map((product) => {
        return <div key={product.id} className="product d-flex align-items-center gap-3">
            <span>{product.name}</span>
            <span>{product.description}</span>
            <span>{product.sell_price}€</span>
            <img src={product.img_url} height="200" width="250" />
            <button className="btn btn-danger" onClick={() => deleteRestaurantProduct(restaurant_id, product.id)}>Delete product</button>
            <Link to={`/edit_product/${product.id}`}><button className="btn btn-warning">Edit product</button></Link>
            <Link to={`/single_product/${product.id}`}><button className="btn btn-primary">View product</button></Link>
        </div>
    })

    const drinkList = drinks.map((product) => {
        return <div key={product.id} className="product d-flex align-items-center gap-3">
            <span>{product.name}</span>
            <span>{product.description}</span>
            <span>{product.sell_price}€</span>
             <img src={product.img_url} height="200" width="250" />
            <button className="btn btn-danger" onClick={() => deleteRestaurantProduct(restaurant_id, product.id)}>Delete product</button>
            <Link to={`/edit_product/${product.id}`}><button className="btn btn-warning">Edit product</button></Link>
            <Link to={`/single_product/${product.id}`}><button className="btn btn-primary">View product</button></Link>
        </div>
    })

    return (
        <div className="product_page d-flex flex-column align-items-center gap-3 mt-4">
            <Link to={`/restaurants/${restaurant_id}/create_product`}><button className="btn btn-primary">Add product</button></Link>
            <div className="products d-flex gap-5">
                <div className="dishes d-flex flex-column gap-2">
                    <h1>Dishes</h1>
                    {dishList}
                </div>
                <div className="drinks d-flex flex-column gap-2">
                    <h1>Drinks</h1>
                    {drinkList}
                </div>
                <Link to="/chef_dashboard">Back to dashboard</Link>
            </div>
        </div>
    )
}

export default RestaurantProducts;