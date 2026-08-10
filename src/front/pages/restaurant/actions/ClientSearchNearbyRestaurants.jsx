import { useEffect, useRef, useState } from "react"
import { useRestaurant } from "../../../hooks/useRestaurant"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { useMapsLibrary } from "@vis.gl/react-google-maps"

const ClientSearchNearbyRestaurants = () => {

    const { getNearbyRestaurants } = useRestaurant()
    const { store } = useGlobalReducer()
    const [startPointData, setStartPointData] = useState({ latitude: "", longitude: "", radius: "" })
    const locationRef = useRef(null)
    const places = useMapsLibrary("places")

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

    async function handleSubmit(e) {
        e.preventDefault()
        getNearbyRestaurants(startPointData)
    }

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
                            <div className="col-6">
                                <label className="form-label" htmlFor="latitude">Latitude</label>
                                <input className="form-control" type="text" id="latitude" onChange={(e) => setStartPointData({ ...startPointData, latitude: e.target.value })} value={startPointData.latitude} />
                            </div>
                            <div className="col-6">
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

            <div className="row g-3">
                {store.restaurants.length > 0 ? store.restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="col-md-6">
                        <div className="card h-100">
                            {restaurant.img_url &&
                                <img src={restaurant.img_url} className="card-img-top" style={{ height: "150px", objectFit: "cover" }} />
                            }
                            <div className="card-body">
                                <h2 className="h5 card-title">{restaurant.name}</h2>
                                <p className="card-text text-muted mb-1">{restaurant.address}</p>
                                <p className="card-text small">{restaurant.phone}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-muted">No restaurants found nearby. Try a different location or radius.</p>
                )}
            </div>

        </div>
    )
}

export default ClientSearchNearbyRestaurants