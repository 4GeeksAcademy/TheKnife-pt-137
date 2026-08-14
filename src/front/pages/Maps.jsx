import { useEffect, useRef, useState } from "react";
import GoogleMap from "./GoogleMap";
import { useParams } from "react-router-dom";
import { useRestaurant } from "../hooks/useRestaurant";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import LoadingComponent from "../components/LoadingComponent";

const Maps = () => {

    const places = useMapsLibrary("places")
    const addressRef = useRef(null)
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null)
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const { chefGetRestaurant, editRestaurantCoords } = useRestaurant()
    const [loading, setLoading] = useState(true)
    const [coordsData, setCoordsData] = useState({ longitude: "", latitude: "", address: "" })

    const handleEdit = (e) => {
        e.preventDefault()
        editRestaurantCoords(restaurant_id, coordsData)
        setCoordsData({ longitude: "", latitude: "", address: "" })
    }

    useEffect(() => {
        setLoading(true)
        chefGetRestaurant(restaurant_id).finally(() => setLoading(false))
        console.log(places)
    }, [restaurant_id])

    useEffect(() => {
        if (store.singleRestaurant) {
            setCoordsData({
                latitude: store.singleRestaurant.latitude,
                longitude: store.singleRestaurant.longitude,
                address: store.singleRestaurant.address
            })
        }
    }, [store.singleRestaurant])

    useEffect(() => {
        console.log("places:", places)
        console.log("input:", addressRef.current)
        if (!places || !addressRef.current) return
        const newPlacesAutocomplete = new places.Autocomplete(
            addressRef.current,
            {
                fields: ["geometry", "name", "formatted_address"]
            }
        )
        console.log("autocomplete:", newPlacesAutocomplete)
        setPlaceAutocomplete(newPlacesAutocomplete)
    }, [places, loading])

    useEffect(() => {
        if (!placeAutocomplete) return
        placeAutocomplete.addListener("place_changed", () => {
            const place = placeAutocomplete.getPlace()
            console.log(place)
            setCoordsData({
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
                address: place.formatted_address
            })
        })
    }, [placeAutocomplete])

    if (loading) return <LoadingComponent />

    const latitude = store.singleRestaurant.latitude ?? 0
    const longitude = store.singleRestaurant.longitude ?? 0

    return (
        <div className="container my-4">
            <form onSubmit={handleEdit} className="card shadow-sm p-4 mb-4">
                <h4 className="card-title mb-3">Ubicación del restaurante</h4>
                <div className="row g-3">
                    <div className="col-md-6" style={{display: "none"}}>
                        <label htmlFor="longitude" className="form-label">Longitude</label>
                        <input type="number" name="longitude" id="longitude" className="form-control" onChange={(e) => setCoordsData({ ...coordsData, longitude: e.target.value })} value={coordsData.longitude} />
                    </div>
                    <div className="col-md-6" style={{display: "none"}}>
                        <label htmlFor="latitude" className="form-label">Latitude</label>
                        <input type="number" name="latitude" id="latitude" className="form-control" onChange={(e) => setCoordsData({ ...coordsData, latitude: e.target.value })} value={coordsData.latitude} />
                    </div>
                    <div className="col-12">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input ref={addressRef} type="text" name="address" id="address" className="form-control" onChange={(e) => setCoordsData({ ...coordsData, address: e.target.value })} value={coordsData.address} />
                    </div>
                </div>
                <div className="text-end mt-4">
                    <input type="submit" value="Submit" className="btn btn-primary" />
                </div>
            </form>
            <GoogleMap
                latitude={Number(coordsData.latitude)}
                longitude={Number(coordsData.longitude)}
                setCoordsData={setCoordsData}
            />
        </div>
    )
}

export default Maps;