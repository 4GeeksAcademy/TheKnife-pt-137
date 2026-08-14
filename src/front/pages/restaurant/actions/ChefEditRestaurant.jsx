import React, { useEffect, useState } from "react";
import { useRestaurant } from "../../../hooks/useRestaurant";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useCloudinary } from "../../../hooks/useCloudinary";

const ChefEditRestaurant = () => {

    const { store } = useGlobalReducer()
    const [restaurantData, setRestaurantData] = useState({name: "", email: "", phone: "", address: "", description: "", food_type: "", img_url: "", tag_ids: []})
    const { chefGetRestaurant, chefEditRestaurant, chefDeleteRestaurant, getTags } = useRestaurant()
    const { uploadImage } = useCloudinary()
    const { restaurant_id } = useParams()

    useEffect(() => {
        chefGetRestaurant(restaurant_id)
        getTags()
    }, [])
    useEffect(() => {
        if (store.singleRestaurant.id) {
            setRestaurantData({
                name: store.singleRestaurant.name,
                email: store.singleRestaurant.email,
                phone: store.singleRestaurant.phone,
                address: store.singleRestaurant.address,
                img_url: store.singleRestaurant.img_url || "",
                description: store.singleRestaurant.description || "",
                food_type: store.singleRestaurant.food_type || "",
                tag_ids: (store.singleRestaurant.tags || []).map((tag) => tag.id)
            })
        }
    }, [store.singleRestaurant])

    const toggleTag = (tagId) => {
        setRestaurantData((prev) => ({
            ...prev,
            tag_ids: prev.tag_ids.includes(tagId)
                ? prev.tag_ids.filter((id) => id !== tagId)
                : [...prev.tag_ids, tagId]
        }))
    }

    async function handleDeleteRestaurant() {
        const confirmation = window.prompt("If you delete the restaurant, all items related to it will be deleted also\n Enter 'DELETE' to delete the restaurant.")
        if (confirmation != "DELETE") return
        chefDeleteRestaurant(restaurant_id)
    }

    return (
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit restaurant</div>
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
                        <input type="file" className="form-control" name="image" id="image" onChange={(e)=>uploadImage(e,"cocinapp_images",setRestaurantData,restaurantData)} />
                    </div>

                    <button onClick={()=>chefEditRestaurant(restaurant_id, restaurantData)} className="btn btn-primary w-100 mb-3">Edit restaurant</button>

                </div>
            </div>

            <div className="card border-danger mt-4">
                <div className="card-header text-danger">Danger zone</div>
                <div className="card-body">
                    <p className="text-muted small mb-3">Deleting the restaurant also deletes every item related to it (waiters, cooks, recipes, orders, products).</p>
                    <button onClick={handleDeleteRestaurant} className="btn btn-outline-danger w-100">Delete restaurant</button>
                </div>
            </div>

        </div>
    )
}

export default ChefEditRestaurant;