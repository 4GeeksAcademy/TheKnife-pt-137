import { useEffect, useRef, useState } from "react"
import { useRestaurant } from "../../../hooks/useRestaurant"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { useMapsLibrary, Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps"

const ClientSearchNearbyRestaurants = () => {

    const { getNearbyRestaurants } = useRestaurant()
    const { store } = useGlobalReducer()
    const [startPointData, setStartPointData] = useState({ latitude: "", longitude: "", radius: "" })
    const locationRef = useRef(null)
    const places = useMapsLibrary("places")
    const map = useMap()
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)

    useEffect(() => {
        if (!places || !locationRef.current) return
        const autoComplete = new places.Autocomplete(locationRef.current)
        autoComplete.addListener("place_changed", () => {
            const place = autoComplete.getPlace()
            const latitude = place.geometry.location.lat()
            const longitude = place.geometry.location.lng()
            setStartPointData(prev => ({
                ...prev,
                latitude: latitude,
                longitude: longitude
            }))
        })
        map.setZoom(12)
    }, [places])

    useEffect(() => {
        if (!map || !startPointData.latitude || !startPointData.longitude) return
        map.panTo({
            lat: Number(startPointData.latitude),
            lng: Number(startPointData.longitude)
        })
    }, [map, startPointData.latitude, startPointData.longitude])

    async function handleSubmit(e) {
        e.preventDefault()
        getNearbyRestaurants(startPointData)
    }

    const center = startPointData.latitude && startPointData.longitude ?
        { lat: startPointData.latitude, lng: startPointData.longitude } :
        { lat: 40.4169, lng: -3.7033 }
    return (
        <div className="container py-4" style={{ maxWidth: "700px" }}>

            <div className="card mb-4">
                <div className="card-header text-center">Search nearby restaurants</div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="location">Location</label>
                            <input className="form-control" type="text" id="location" placeholder="Search an address..." ref={locationRef} />
                        </div>

                        <div className="row mb-3">
                            <div className="col-6" style={{display: "none"}}>
                                <label className="form-label" htmlFor="latitude">Latitude</label>
                                <input className="form-control" type="text" id="latitude" onChange={(e) => setStartPointData({ ...startPointData, latitude: e.target.value })} value={startPointData.latitude} />
                            </div>
                            <div className="col-6" style={{display: "none"}}>
                                <label className="form-label" htmlFor="longitude">Longitude</label>
                                <input className="form-control" type="text" id="longitude" onChange={(e) => setStartPointData({ ...startPointData, longitude: e.target.value })} value={startPointData.longitude} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="radius">Search radius (km)</label>
                            <input className="form-control" type="number" name="radius" id="radius" onChange={(e) => setStartPointData({ ...startPointData, radius: e.target.value })} value={startPointData.radius} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Search</button>
                    </form>
                </div>
            </div>

            <div style={{ width: "100%", height: "500px" }}>
                <Map defaultCenter={center} defaultZoom={7} mapId="DEMO_MAP_ID" onClick={(e) => setStartPointData({ ...startPointData, latitude: e.detail.latLng.lat, longitude: e.detail.latLng.lng })}>
                    {startPointData.latitude && startPointData.longitude ?
                        <AdvancedMarker
                            draggable={true}
                            onDragEnd={(e) => {setStartPointData({ ...startPointData, latitude: e.latLng.lat(), longitude: e.latLng.lng()})}}
                            position={{ lat: Number(startPointData.latitude), lng: Number(startPointData.longitude) }}><div style={{ fontSize: "32px" }}>📍</div></AdvancedMarker> : null}

                    {store.restaurants.map((restaurant) => {
                        return <AdvancedMarker
                            key={restaurant.id}
                            position={{ lat: Number(restaurant.latitude), lng: Number(restaurant.longitude) }}
                            onClick={()=>setSelectedRestaurant(restaurant)}
                        ><div style={{ fontSize: "32px" }}>🍽️</div></AdvancedMarker>
                    })}
                </Map>
                {selectedRestaurant ? (
                    <div className="card mt-3 shadow-sm border-0">
                        <div className="card-body d-flex align-items-start">
                            <div style={{ fontSize: "28px" }} className="me-3">🍽️</div>
                            <div className="flex-grow-1">
                                <h5 className="card-title mb-1">{selectedRestaurant.name}</h5>
                                <p className="card-text text-muted mb-0">
                                    <span className="me-1">📍</span>
                                    {selectedRestaurant.address}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setSelectedRestaurant(null)}
                            ></button>
                        </div>
                    </div>
                ) : null}
            </div>


        </div>
    )
}

export default ClientSearchNearbyRestaurants