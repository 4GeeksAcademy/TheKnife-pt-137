import React, { useEffect, useState } from "react";
import { useProduct } from "../../../hooks/useProduct";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useCloudinary } from "../../../hooks/useCloudinary";
import { useRecipe } from "../../../hooks/useRecipe";

const ChefProductCreate = () => {

    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [productData, setProductData] = useState({ name: "", description: "", sellPrice: 0, type: "", recipe_id: "", img_url: "" })
    const { getAllRestaurantRecipes } = useRecipe()
    const { uploadImage } = useCloudinary()
    const { chefCreateProduct } = useProduct()

    useEffect(() => {
        getAllRestaurantRecipes(restaurant_id)
    }, [])

    const recipes = store.recipes.map((recipe) => {
        return <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
    })

    return (
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new product</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setProductData({ ...productData, name: e.target.value })} value={productData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="description">Description</label>
                        <input className="form-control" onChange={(e) => setProductData({ ...productData, description: e.target.value })} value={productData.description} type="text" name="description" id="description" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="sellprice">Sell Price (€)</label>
                        <input className="form-control" onChange={(e) => setProductData({ ...productData, sellPrice: e.target.value })} value={productData.sellPrice} type="number" name="sellprice" id="sellprice" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="type">Type</label>
                        <select className="form-select" onChange={(e) => setProductData({ ...productData, type: e.target.value })} value={productData.type} name="type" id="type">
                            <option value="">Select one product type</option>
                            <option value="dish">Dish</option>
                            <option value="drink">Drink</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="recipeid">Recipe</label>
                        <select className="form-select" onChange={(e) => setProductData({ ...productData, recipe_id: e.target.value })} value={productData.recipe_id} name="recipeid" id="recipeid">
                            <option value="">None</option>
                            {recipes}
                        </select>
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e)=>uploadImage(e, "cocinapp_images", setProductData, productData)} />
                    </div>

                    <button onClick={() => chefCreateProduct(restaurant_id, productData)} className="btn btn-primary w-100 mb-3">Create new product</button>

                </div>
            </div>

        </div>
    )
}

export default ChefProductCreate;