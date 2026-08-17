import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useRestaurant } from "../../../hooks/useRestaurant"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { useMapsLibrary, Map, useMap, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps"

const PANEL_HEIGHT = "560px"

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
    }, [places])

    useEffect(() => {
        if (!map) return
        map.setZoom(12)
    }, [map])

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
        <div className="nearby_search_page">

            <div className="client-page-header">
                <div>
                    <h1 className="client-page-title">Restaurantes cercanos</h1>
                    <div className="dashboard-welcome-subtitle">
                        <i className="fa-solid fa-map-location-dot"></i>
                        Busca una ubicación y descubre qué hay cerca
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3 align-items-end">

                        <div className="col-md-6">
                            <label className="simple-form-label" htmlFor="location">Ubicación</label>
                            <div className="product-search" style={{ width: "100%" }}>
                                <i className="fa-solid fa-location-dot"></i>
                                <input className="form-control" type="text" id="location" placeholder="Busca una dirección..." ref={locationRef} />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="simple-form-label" htmlFor="radius">Radio de búsqueda (km)</label>
                            <input className="form-control" type="number" name="radius" id="radius" onChange={(e) => setStartPointData({ ...startPointData, radius: e.target.value })} value={startPointData.radius} />
                        </div>

                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">
                                <i className="fa-solid fa-magnifying-glass me-1"></i>Buscar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-lg-7">
                    <div className="card" style={{ height: PANEL_HEIGHT, overflow: "hidden" }}>
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
                                ><i className="fa-solid fa-location-dot" style={{ fontSize: "30px", color: "#00483F"}}></i></AdvancedMarker>
                            })}

                            {selectedRestaurant && (
                                <InfoWindow
                                    position={{ lat: Number(selectedRestaurant.latitude), lng: Number(selectedRestaurant.longitude) }}
                                    onCloseClick={() => setSelectedRestaurant(null)}
                                >
                                    <div style={{ width: "220px" }}>
                                        {selectedRestaurant.img_url && (
                                            <img
                                                src={selectedRestaurant.img_url}
                                                style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                                            />
                                        )}
                                        <h6 className="mb-1 mt-2">{selectedRestaurant.name}</h6>
                                        {selectedRestaurant.food_type && (
                                            <span className="food-type-badge">{selectedRestaurant.food_type}</span>
                                        )}
                                        <div className="d-flex gap-2 mt-2">
                                            <Link
                                                to={`/restaurants/${selectedRestaurant.id}/dishes`}
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                Ver platos
                                            </Link>
                                            <Link
                                                to={`/restaurants/${selectedRestaurant.id}/reserve`}
                                                className="btn btn-primary btn-sm"
                                            >
                                                Reservar
                                            </Link>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </Map>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card" style={{ height: PANEL_HEIGHT, overflowY: "auto" }}>
                        <div className="card-body">
                            {store.restaurants.length > 0 ? (
                                <div className="product-list">
                                    {store.restaurants.map((restaurant) => (
                                        <div
                                            key={restaurant.id}
                                            className={`product-row ${selectedRestaurant?.id === restaurant.id ? "product-row-selected" : ""}`}
                                            onClick={() => setSelectedRestaurant(restaurant)}
                                            role="button"
                                            style={{ cursor: "pointer" }}
                                        >
                                            {restaurant.img_url ? (
                                                <img src={restaurant.img_url} className="product-row-img" alt={restaurant.name} />
                                            ) : (
                                                <div className="product-row-img product-row-img-placeholder">
                                                    <i className="fa-solid fa-store"></i>
                                                </div>
                                            )}
                                            <div className="product-row-info">
                                                <div className="product-row-title">
                                                    <span className="product-row-name">{restaurant.name}</span>
                                                    {restaurant.food_type && <span className="food-type-badge mb-0">{restaurant.food_type}</span>}
                                                </div>
                                                <p className="product-row-desc mb-1"><i className="fa-solid fa-location-dot me-1"></i>{restaurant.address}</p>
                                                {restaurant.description && (
                                                    <p className="product-row-desc restaurant-description-clamp mb-2">{restaurant.description}</p>
                                                )}
                                                <div className="d-flex gap-2">
                                                    <Link
                                                        to={`/restaurants/${restaurant.id}/dishes`}
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Ver platos
                                                    </Link>
                                                    <Link
                                                        to={`/restaurants/${restaurant.id}/reserve`}
                                                        className="btn btn-primary btn-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Reservar mesa
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-center py-4 mb-0">Busca una ubicación para ver los restaurantes cercanos.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ClientSearchNearbyRestaurants
