import React, { useEffect, useState } from "react";
import { useProduct } from "../../../hooks/useProduct";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useCloudinary } from "../../../hooks/useCloudinary";

const ChefEditProduct = () => {

    const { store } = useGlobalReducer()
    const [productData, setProductData] = useState({name: "", description: "", sellPrice: 0, type: "", active: true, img_url: ""})
    const { getOneRestaurantProduct, chefEditProduct } = useProduct()
    const { product_id, restaurant_id } = useParams()
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        getOneRestaurantProduct(restaurant_id, product_id)
    }, [])
    useEffect(() => {
        if (store.singleProduct.id) {
            setProductData({
                name: store.singleProduct.name,
                description: store.singleProduct.description,
                sellPrice: store.singleProduct.sell_price,
                type: store.singleProduct.type,
                active: store.singleProduct.active,
                img_url: store.singleProduct.img_url
            })
        }
    }, [store.singleProduct])
    
    return (
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit product</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e)=>setProductData({...productData, name: e.target.value})} value={productData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="description">Description</label>
                        <input className="form-control" onChange={(e)=>setProductData({...productData, description: e.target.value})} value={productData.description} type="text" name="description" id="description" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="sellprice">Sell Price (€)</label>
                        <input className="form-control" onChange={(e)=>setProductData({...productData, sellPrice: e.target.value})} value={productData.sellPrice} type="number" name="sellprice" id="sellprice" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="type">Type</label>
                        <select className="form-select" onChange={(e)=>setProductData({...productData, type: e.target.value})} value={productData.type} name="type" id="type">
                            <option value="">Select one product type</option>
                            <option value="dish">Dish</option>
                            <option value="drink">Drink</option>
                        </select>
                    </div>

                    <div className="mb-3 form-check">
                        <input className="form-check-input" onChange={(e)=>setProductData({...productData, active: e.target.checked})} checked={productData.active} type="checkbox" name="active" id="active" />
                        <label className="form-check-label" htmlFor="active">Active</label>
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e)=>uploadImage(e,"cocinapp_images", setProductData,productData)} />
                    </div>

                    <button onClick={()=>chefEditProduct(restaurant_id, product_id, productData)} className="btn btn-primary w-100 mb-3">Edit product</button>

                </div>
            </div>

        </div>
    )
}

export default ChefEditProduct;