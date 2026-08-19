import React, { useEffect, useRef, useState } from "react";
import { useRestaurant } from "../../../hooks/useRestaurant";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import {useCloudinary} from "../../../hooks/useCloudinary"
import { useMapsLibrary } from "@vis.gl/react-google-maps";

const ChefCreateRestaurant = () => {

    const [restaurantData, setRestaurantData] = useState({name: "", email: "", phone: "", address: "", description: "", food_type: "", img_url: "", tag_ids: []})
    const { chefCreateRestaurant, getTags } = useRestaurant()
    const { store } = useGlobalReducer()
    const { uploadImage } = useCloudinary()
    const addressRef = useRef(null)
    const places = useMapsLibrary("places")

    useEffect(() => {
        getTags()
    }, [])

    useEffect(() => {
        if (!places || !addressRef.current) return
        const autocomplete = new places.Autocomplete(addressRef.current, {
            fields: ["formatted_address"]
        })
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace()
            if (place.formatted_address) {
                setRestaurantData((prev) => ({ ...prev, address: place.formatted_address }))
            }
        })
    }, [places])

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
                <div className="card-header text-center">Crear nuevo restaurante</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e)=>setRestaurantData({...restaurantData, name: e.target.value})} value={restaurantData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setRestaurantData({...restaurantData, email: e.target.value})} value={restaurantData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="phone">Teléfono</label>
                        <input className="form-control" onChange={(e)=>setRestaurantData({...restaurantData, phone: e.target.value})} value={restaurantData.phone} type="text" name="phone" id="phone" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="address">Dirección</label>
                        <input ref={addressRef} className="form-control" type="text" onChange={(e)=>setRestaurantData({...restaurantData, address: e.target.value})} value={restaurantData.address} name="address" id="address" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="description">Descripción</label>
                        <textarea className="form-control" onChange={(e)=>setRestaurantData({...restaurantData, description: e.target.value})} value={restaurantData.description} name="description" id="description" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="food_type">Tipo de cocina</label>
                        <input className="form-control" type="text" placeholder="ej. Italiana, Mexicana, Mediterránea..." onChange={(e)=>setRestaurantData({...restaurantData, food_type: e.target.value})} value={restaurantData.food_type} name="food_type" id="food_type" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label d-block">Etiquetas de ocasión</label>
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

                    <button onClick={()=>chefCreateRestaurant(restaurantData)} className="btn btn-primary w-100 mb-3">Crear nuevo restaurante</button>

                </div>
            </div>

        </div>
    )
}

export default ChefCreateRestaurant;