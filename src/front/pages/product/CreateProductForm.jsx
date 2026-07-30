import React, { useState } from "react";
import { useProduct } from "../../hooks/useProduct";
import { Link } from "react-router-dom";

const CreateProductForm = () => {

    const [productData, setProductData] = useState({name: "", description: "", sellPrice: 0, type: "", restaurant_id: 0, recipe_id: 0})
    const { createProduct } = useProduct()

    return (
        <div className="product_form d-flex flex-column align-items-center gap-3">
            <h1>Create new product</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e)=>setProductData({...productData, name: e.target.value})} value={productData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input onChange={(e)=>setProductData({...productData, description: e.target.value})} value={productData.description} type="text" name="description" id="description" />
            </div>
            <div>
                <label htmlFor="sellprice">Sell Price</label>
                <input onChange={(e)=>setProductData({...productData, sellPrice: e.target.value})} value={productData.sellPrice} type="number" name="sellprice" id="sellprice" />
                <span>€</span>
            </div>
            <div>
                <label htmlFor="type">Type</label>
                <select onChange={(e)=>setProductData({...productData, type: e.target.value})} value={productData.type} name="type" id="type">
                    <option value="">Select one product type</option>
                    <option value="dish">Dish</option>
                    <option value="drink">Drink</option>
                </select>
            </div>
            <div>
                <label htmlFor="restaurantid">Restaurant id</label>
                <input onChange={(e)=>setProductData({...productData, restaurant_id: e.target.value})} value={productData.restaurant_id} type="number" name="restaurantid" id="restaurantid" />
            </div>
            <div>
                <label htmlFor="recipeid">Recipe id</label>
                <input onChange={(e)=>setProductData({...productData, recipe_id: e.target.value})} value={productData.recipe_id} type="number" name="recipeid" id="recipeid" />
            </div>
            <button onClick={()=>createProduct(productData)} className="btn btn-primary">Create new product</button>
            <Link to="/products">Back to products</Link>
        </div>
    )
}

export default CreateProductForm;