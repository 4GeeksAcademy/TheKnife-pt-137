import React, { useEffect, useState } from "react";
import { useRestaurant } from "../../../hooks/useRestaurant";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import {useCloudinary} from "../../../hooks/useCloudinary"

const ChefCreateRestaurant = () => {

    const [restaurantData, setRestaurantData] = useState({name: "", email: "", phone: "", address: "", description: "", food_type: "", img_url: "", tag_ids: []})
    const { chefCreateRestaurant, getTags } = useRestaurant()
    const { store } = useGlobalReducer()
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        getTags()
    }, [])

    const toggleTag = (tagId) => {
        setRestaurantData((prev) => ({
            ...prev,
            tag_ids: prev.tag_ids.includes(tagId)
                ? prev.tag_ids.filter((id) => id !== tagId)
                : [...prev.tag_ids, tagId]
        }))
    }

    return (
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new restaurant</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e)=>setRestaurantData({...restaurantData, name: e.target.value})} value={restaurantData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setRestaurantData({...restaurantData, email: e.target.value})} value={restaurantData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="phone">Phone</label>
                        <input className="form-control" onChange={(e)=>setRestaurantData({...restaurantData, phone: e.target.value})} value={restaurantData.phone} type="text" name="phone" id="phone" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="address">Address</label>
                        <input className="form-control" type="text" onChange={(e)=>setRestaurantData({...restaurantData, address: e.target.value})} value={restaurantData.address} name="address" id="address" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea className="form-control" onChange={(e)=>setRestaurantData({...restaurantData, description: e.target.value})} value={restaurantData.description} name="description" id="description" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="food_type">Food type</label>
                        <input className="form-control" type="text" placeholder="e.g. Italian, Mexican, Mediterranean..." onChange={(e)=>setRestaurantData({...restaurantData, food_type: e.target.value})} value={restaurantData.food_type} name="food_type" id="food_type" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label d-block">Occasion tags</label>
                        <div className="d-flex flex-wrap gap-2">
                            {store.tags.map((tag) => {
                                const active = restaurantData.tag_ids.includes(tag.id)
                                return (
                                    <button type="button" key={tag.id}
                                        className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={()=>toggleTag(tag.id)}>
                                        {tag.name}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" name="image" id="image" onChange={(e)=>uploadImage(e, "cocinapp_images", setRestaurantData, restaurantData)} />
                    </div>

                    <button onClick={()=>chefCreateRestaurant(restaurantData)} className="btn btn-primary w-100 mb-3">Create new restaurant</button>

                </div>
            </div>

        </div>
    )
}

export default ChefCreateRestaurant;