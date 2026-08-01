import React, { useEffect, useState } from "react";
import { useProduct } from "../../hooks/useProduct";
import { useRestaurant } from "../../hooks/useRestaurant";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CreateProductForm = () => {

    const { store } = useGlobalReducer()
    const [productData, setProductData] = useState({ name: "", description: "", sellPrice: 0, type: "", restaurant_id: "", recipe_id: "", img_url: "" })
    const { createProduct } = useProduct()
    const { getRestaurants } = useRestaurant()

    useEffect(() => {
        getRestaurants()
    }, [])

    const restaurants = store.restaurants.map((restaurant) => {
        return <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
    })

    return (
        <div className="product_form d-flex flex-column align-items-center gap-3">
            <h1>Create new product</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e) => setProductData({ ...productData, name: e.target.value })} value={productData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input onChange={(e) => setProductData({ ...productData, description: e.target.value })} value={productData.description} type="text" name="description" id="description" />
            </div>
            <div>
                <label htmlFor="sellprice">Sell Price</label>
                <input onChange={(e) => setProductData({ ...productData, sellPrice: e.target.value })} value={productData.sellPrice} type="number" name="sellprice" id="sellprice" />
                <span>€</span>
            </div>
            <div>
                <label htmlFor="type">Type</label>
                <select onChange={(e) => setProductData({ ...productData, type: e.target.value })} value={productData.type} name="type" id="type">
                    <option value="">Select one product type</option>
                    <option value="dish">Dish</option>
                    <option value="drink">Drink</option>
                </select>
            </div>
            <div>
                <label htmlFor="restaurant">Restaurant</label>
                <select onChange={(e) => setProductData({ ...productData, restaurant_id: e.target.value })} value={productData.restaurant_id} name="restaurantid" id="restaurantid" >
                    <option value="">Select a restaurant</option>
                    {restaurants}
                </select>
            </div>
            <div>
                <label htmlFor="recipeid">Recipe id</label>
                <select onChange={(e) => setProductData({ ...productData, recipe_id: e.target.value })} value={productData.recipe_id} name="recipeid" id="recipeid">
                    <option value="">none</option>
                </select>
            </div>
            <input
                type="file"
                onChange={async (e) => {
                    const image = e.target.files[0]
                    const formData = new FormData()
                    formData.append("file", image)
                    formData.append("upload_preset", "cocinapp_images") 
                    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
                        method: "POST",
                        body: formData
                    })
                    const data = await response.json()
                    setProductData({ 
                        ...productData,
                        img_url: data.secure_url
                    })
                }}
            />
            <button onClick={() => createProduct(productData)} className="btn btn-primary">Create new product</button>
            <Link to="/products">Back to products</Link>
        </div>
    )
}

export default CreateProductForm;