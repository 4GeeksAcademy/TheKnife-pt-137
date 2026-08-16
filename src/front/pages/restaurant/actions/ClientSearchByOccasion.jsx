import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../../hooks/useRestaurant";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import LoadingComponent from "../../../components/LoadingComponent";

const ClientSearchByOccasion = () => {

    const { getTags, searchRestaurantsByOccasion } = useRestaurant();
    const { store } = useGlobalReducer();

    const [foodType, setFoodType] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        searchRestaurantsByOccasion({ food_type: foodType, tags: selectedTags }).finally(() => setLoading(false));
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
        <div className="occasion_search_page">
            <div className="client-page-header">
                <div>
                    <h1 className="client-page-title">Buscar por ocasión</h1>
                    <div className="dashboard-welcome-subtitle">
                        <i className="fa-solid fa-champagne-glasses"></i>
                        Elige el tipo de comida y el plan que buscas
                    </div>
                </div>
            </div>

            <form className="card mb-4" onSubmit={handleSearch}>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="simple-form-label" htmlFor="food_type">Tipo de comida</label>
                        <div className="product-search" style={{ width: "100%" }}>
                            <i className="fa-solid fa-utensils"></i>
                            <input className="form-control" type="text" id="food_type"
                                placeholder="italiana, mexicana, sushi..."
                                value={foodType}
                                onChange={(e) => setFoodType(e.target.value)} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="simple-form-label d-block">Ocasión</label>
                        <div className="product-filter-tabs flex-wrap">
                            {store.tags.map((tag) => {
                                const active = selectedTags.includes(tag.name);
                                return (
                                    <button
                                        type="button"
                                        key={tag.id}
                                        className={`product-filter-btn ${active ? "active" : ""}`}
                                        onClick={() => toggleTag(tag.name)}>
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            <i className="fa-solid fa-magnifying-glass me-1"></i>Buscar
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>Limpiar</button>
                    </div>
                </div>
            </form>

            {searched && (
                loading ? <LoadingComponent /> : (
                    <div>
                        <h2 className="client-page-title mb-3" style={{ fontSize: "1.1rem" }}>
                            {results.length} restaurante{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
                        </h2>
                        {results.length > 0 ? (
                            <div className="row row-cols-1 row-cols-md-2 g-4">
                                {results.map((restaurant) => (
                                    <div className="col" key={restaurant.id}>
                                        <div className="recipe-card card h-100">
                                            <div className="recipe-card-media">
                                                {restaurant.img_url ? (
                                                    <img src={restaurant.img_url} className="recipe-card-img" alt={restaurant.name} />
                                                ) : (
                                                    <div className="recipe-card-img recipe-card-img-placeholder">
                                                        <i className="fa-solid fa-store"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="card-body d-flex flex-column">
                                                <h3 className="recipe-card-title">{restaurant.name}</h3>
                                                {restaurant.food_type && <span className="food-type-badge">{restaurant.food_type}</span>}
                                                <div className="restaurant-contact-list">
                                                    <span><i className="fa-solid fa-location-dot"></i>{restaurant.address}</span>
                                                </div>
                                                {(restaurant.tags || []).length > 0 && (
                                                    <div className="restaurant-tags">
                                                        {restaurant.tags.map((tag) => (
                                                            <span key={tag.id} className="tag-pill"><i className="fa-solid fa-tag"></i>{tag.name}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="d-flex gap-2 mt-auto">
                                                    <Link to={`/restaurants/${restaurant.id}/dishes`} className="btn btn-outline-primary btn-sm">Ver platos</Link>
                                                    <Link to={`/restaurants/${restaurant.id}/reserve`} className="btn btn-primary btn-sm">Reservar mesa</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card">
                                <p className="text-muted text-center py-4 mb-0">No hay restaurantes que coincidan. Prueba con menos filtros.</p>
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default ClientSearchByOccasion;
