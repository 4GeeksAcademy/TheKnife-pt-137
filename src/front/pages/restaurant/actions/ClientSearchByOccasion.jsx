import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../../hooks/useRestaurant";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ClientSearchByOccasion = () => {

    const { getTags, searchRestaurantsByOccasion } = useRestaurant();
    const { store } = useGlobalReducer();

    const [foodType, setFoodType] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        getTags();
    }, []);

    const toggleTag = (tagName) => {
        setSelectedTags((prev) =>
            prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchRestaurantsByOccasion({ food_type: foodType, tags: selectedTags });
        setSearched(true);
    };

    const handleClear = () => {
        setFoodType("");
        setSelectedTags([]);
        setSearched(false);
        searchRestaurantsByOccasion({});
    };

    const results = store.restaurants || [];

    return (
        <div className="container py-4" style={{ maxWidth: "800px" }}>

            <h1 className="h3 mb-1">Find a restaurant for your occasion</h1>
            <p className="text-muted">Pick the vibe and the kind of food you're looking for.</p>

            <form className="card mb-4" onSubmit={handleSearch}>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="food_type">Type of food</label>
                        <input className="form-control" type="text" id="food_type"
                            placeholder="e.g. italiana, mexicana, sushi..."
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label d-block">Occasion</label>
                        <div className="d-flex flex-wrap gap-2">
                            {store.tags.map((tag) => {
                                const active = selectedTags.includes(tag.name);
                                return (
                                    <button
                                        type="button"
                                        key={tag.id}
                                        className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => toggleTag(tag.name)}>
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">Search</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>Clear</button>
                    </div>
                </div>
            </form>

            {searched && (
                <div>
                    <h2 className="h5 mb-3">{results.length} restaurant(s) found</h2>
                    {results.length === 0 ? (
                        <p className="text-muted">No restaurants match your search. Try fewer filters.</p>
                    ) : (
                        <div className="row g-3">
                            {results.map((restaurant) => (
                                <div className="col-md-6" key={restaurant.id}>
                                    <div className="card h-100">
                                        {restaurant.img_url && (
                                            <img src={restaurant.img_url} className="card-img-top" alt={restaurant.name}
                                                style={{ height: "160px", objectFit: "cover" }} />
                                        )}
                                        <div className="card-body">
                                            <h3 className="h5 mb-1">{restaurant.name}</h3>
                                            {restaurant.food_type && (
                                                <p className="text-muted mb-2">🍽️ {restaurant.food_type}</p>
                                            )}
                                            <p className="text-muted mb-2"><span className="me-1">📍</span>{restaurant.address}</p>
                                            <div className="d-flex flex-wrap gap-1 mb-3">
                                                {(restaurant.tags || []).map((tag) => (
                                                    <span key={tag.id} className="badge bg-secondary">{tag.name}</span>
                                                ))}
                                            </div>
                                            <Link
                                                to={`/restaurants/${restaurant.id}/dishes`}
                                                className="btn btn-primary btn-sm align-self-start"
                                            >
                                                View dishes
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default ClientSearchByOccasion;
