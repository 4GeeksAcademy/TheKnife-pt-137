import React, { useEffect, useState } from "react";
import { useRestaurant } from "../../hooks/useRestaurant";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const EditRestaurantForm = () => {

    const { store } = useGlobalReducer()
    const [restaurantData, setRestaurantData] = useState({name: "", email: "", phone: "", address: "", })
    const { getSingleRestaurant, editRestaurant } = useRestaurant()
    const { restaurant_id } = useParams()

    useEffect(() => {
        getSingleRestaurant(restaurant_id)
    }, [])
    useEffect(() => {
        if (store.singleRestaurant.id) {
            setRestaurantData({
                name: store.singleRestaurant.name,
                email: store.singleRestaurant.email,
                phone: store.singleRestaurant.phone,
                address: store.singleRestaurant.address
            })
        }
    }, [store.singleRestaurant])

    async function handleUpload(e) {
        const image = e.target.files[0]
        const formData = new FormData()
        formData.append("file", image)
        formData.append("upload_preset", "cocinapp_images")
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        })
        const data = await response.json()
        console.log(data)
        setRestaurantData({...restaurantData, img_url: data.secure_url})
    }
    
    return (
        <div className="restaurant_form d-flex flex-column align-items-center gap-3">
            <h1>Edit restaurant</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e)=>setRestaurantData({...restaurantData, name: e.target.value})} value={restaurantData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e)=>setRestaurantData({...restaurantData, email: e.target.value})} value={restaurantData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="phone">Phone</label>
                <input onChange={(e)=>setRestaurantData({...restaurantData, phone: e.target.value})} value={restaurantData.phone} type="text" name="phone" id="phone" />
            </div>
            <div>
                <label htmlFor="type">Address</label>
                <input type="text" onChange={(e)=>setRestaurantData({...restaurantData, address: e.target.value})} value={restaurantData.address} name="address" id="address" />
            </div>
            <input type="file" name="image" id="image" onChange={handleUpload} />
            <button onClick={()=>editRestaurant(restaurant_id, restaurantData)} className="btn btn-primary">Edit restaurant</button>
            <Link to="/restaurants">Back to restaurants</Link>
        </div>
    )
}

export default EditRestaurantForm;