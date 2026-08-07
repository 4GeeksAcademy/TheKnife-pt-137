import { useEffect, useState } from "react";
import GoogleMap from "./GoogleMap";
import { useParams } from "react-router-dom";
import { useRestaurant } from "../hooks/useRestaurant";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Maps = () => {

    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const { getSingleRestaurant } = useRestaurant()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getSingleRestaurant(restaurant_id).finally(() => setLoading(false))
    }, [restaurant_id])

    if (loading) return <p className="text-center">Loading...</p>

    const latitude = store.singleRestaurant.latitude ?? 0
    const longitude = store.singleRestaurant.longitude ?? 0 

    return (
        <>
            <GoogleMap longitude={longitude} latitude={latitude} />
        </>
    )
}

export default Maps;