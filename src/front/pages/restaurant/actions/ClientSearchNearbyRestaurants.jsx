import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useRestaurant } from "../../../hooks/useRestaurant"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { useMapsLibrary, Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps"

const PANEL_HEIGHT = "600px"

const ClientSearchNearbyRestaurants = () => {

    const { getNearbyRestaurants } = useRestaurant()
    const { store } = useGlobalReducer()
    const [startPointData, setStartPointData] = useState({ latitude: "", longitude: "", radius: "" })
    const locationRef = useRef(null)
    const places = useMapsLibrary("places")
    const map = useMap()
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)

    useEffect(() => {
        if (!places || !locationRef.current || !map) return
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
        <div className="container-fluid py-4">

            <div className="card mb-4">
                <div className="card-header text-center">Search nearby restaurants</div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3 align-items-end">

                        <div className="col-md-6">
                            <label className="form-label" htmlFor="location">Location</label>
                            <input className="form-control" type="text" id="location" placeholder="Search an address..." ref={locationRef} />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" htmlFor="radius">Search radius (km)</label>
                            <input className="form-control" type="number" name="radius" id="radius" onChange={(e) => setStartPointData({ ...startPointData, radius: e.target.value })} value={startPointData.radius} />
                        </div>

                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Search</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-lg-7">
                    <div style={{ height: PANEL_HEIGHT }}>
                        <Map defaultCenter={center} defaultZoom={7} mapId="DEMO_MAP_ID" onClick={(e) => setStartPointData({ ...startPointData, latitude: e.detail.latLng.lat, longitude: e.detail.latLng.lng })}>
                            {startPointData.latitude && startPointData.longitude ?
                                <AdvancedMarker
                                    draggable={true}
                                    onDragEnd={(e) => { setStartPointData({ ...startPointData, latitude: e.latLng.lat(), longitude: e.latLng.lng() }) }}
                                    position={{ lat: Number(startPointData.latitude), lng: Number(startPointData.longitude) }}><div style={{ fontSize: "32px" }}>📍</div></AdvancedMarker> : null}

                            {store.restaurants.map((restaurant) => {
                                return <AdvancedMarker
                                    key={restaurant.id}
                                    position={{ lat: Number(restaurant.latitude), lng: Number(restaurant.longitude) }}
                                    onClick={() => setSelectedRestaurant(restaurant)}
                                ><div style={{ fontSize: "32px" }}>🍽️</div></AdvancedMarker>
                            })}
                        </Map>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div style={{ height: PANEL_HEIGHT, overflowY: "auto" }}>
                        {store.restaurants.length === 0 ? (
                            <p className="text-muted">Busca una ubicación para ver los restaurantes cercanos.</p>
                        ) : (
                            store.restaurants.map((restaurant) => (
                                <div
                                    key={restaurant.id}
                                    className={`card mb-3 ${selectedRestaurant?.id === restaurant.id ? "border-primary" : ""}`}
                                    onClick={() => setSelectedRestaurant(restaurant)}
                                    role="button"
                                >
                                    <div className="row g-0">
                                        <div className="col-4">
                                            <img
                                                src={restaurant.img_url}
                                                className="img-fluid rounded-start h-100"
                                                style={{ objectFit: "cover", minHeight: "140px" }}
                                            />
                                        </div>
                                        <div className="col-8">
                                            <div className="card-body d-flex flex-column h-100">
                                                <h5 className="card-title mb-1">{restaurant.name}</h5>
                                                {restaurant.food_type && (
                                                    <span className="badge bg-secondary mb-2 align-self-start">{restaurant.food_type}</span>
                                                )}
                                                <p className="card-text text-muted small mb-1">
                                                    <span className="me-1">📍</span>{restaurant.address}
                                                </p>
                                                {restaurant.description && (
                                                    <p className="card-text small flex-grow-1">{restaurant.description}</p>
                                                )}
                                                <div className="d-flex gap-2 mt-2">
                                                    <Link
                                                        to={`/restaurants/${restaurant.id}/dishes`}
                                                        className="btn btn-primary btn-sm align-self-start"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        View dishes
                                                    </Link>
                                                    <Link
                                                        to={`/restaurants/${restaurant.id}/reserve`}
                                                        className="btn btn-success btn-sm align-self-start"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Book a table
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ClientSearchNearbyRestaurants
