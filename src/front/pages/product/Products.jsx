import React, { useEffect } from "react";
import { useProduct } from "../../hooks/useProduct";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const Product = () => {

    const { getProducts, deleteProduct } = useProduct()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getProducts()
    }, [])

    const dishes = store.products.filter((product) => product.type === "dish")
    const drinks = store.products.filter((product) => product.type === "drink")

    const dishList = dishes.map((product) => {
        return <div key={product.id} className="product d-flex align-items-center gap-3">
            <span>{product.name}</span>
            <span>{product.description}</span>
            <span>{product.sell_price}€</span>
            <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>Delete product</button>
            <Link to={`/edit_product/${product.id}`}><button className="btn btn-warning">Edit product</button></Link>
            <Link to={`/single_product/${product.id}`}><button className="btn btn-primary">View product</button></Link>
        </div>
    })

    const drinkList = drinks.map((product) => {
        return <div key={product.id} className="product d-flex align-items-center gap-3">
            <span>{product.name}</span>
            <span>{product.description}</span>
            <span>{product.sell_price}€</span>
            <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>Delete product</button>
            <Link to={`/edit_product/${product.id}`}><button className="btn btn-warning">Edit product</button></Link>
            <Link to={`/single_product/${product.id}`}><button className="btn btn-primary">View product</button></Link>
        </div>
    })

    return (
        <div className="product_page d-flex flex-column align-items-center gap-3 mt-4">
            <Link to="/create_product"><button className="btn btn-primary">Add product</button></Link>
            <div className="products d-flex gap-5">
                <div className="dishes d-flex flex-column gap-2">
                    <h1>Dishes</h1>
                    {dishList}
                </div>
                <div className="drinks d-flex flex-column gap-2">
                    <h1>Drinks</h1>
                    {drinkList}
                </div>
            </div>
        </div>
    )
}

export default Product;