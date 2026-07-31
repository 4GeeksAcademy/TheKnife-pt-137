import React, { useEffect, useState } from "react";
import { useProduct } from "../../hooks/useProduct";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const EditProductForm = () => {

    const { store } = useGlobalReducer()
    const [productData, setProductData] = useState({name: "", description: "", sellPrice: 0, type: "", active: true, img_url: ""})
    const { getSingleProduct, editProduct } = useProduct()
    const { product_id } = useParams()

    useEffect(() => {
        getSingleProduct(product_id)
    }, [])
    useEffect(() => {
        if (store.singleProduct.id) {
            setProductData({
                name: store.singleProduct.name,
                description: store.singleProduct.description,
                sellPrice: store.singleProduct.sell_price,
                type: store.singleProduct.type,
                active: store.singleProduct.active
            })
        }
    }, [store.singleProduct])
    
    return (
        <div className="product_form d-flex flex-column align-items-center gap-3">
            <h1>Edit  product</h1>
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
                <label htmlFor="active">Active</label>
                <input onChange={(e)=>setProductData({...productData, active: e.target.checked})} checked={productData.active} type="checkbox" name="active" id="active" />
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
            <button onClick={()=>editProduct(product_id, productData)} className="btn btn-primary">Edit product</button>
            <Link to="/products">Back to products</Link>
        </div>
    )
}

export default EditProductForm;