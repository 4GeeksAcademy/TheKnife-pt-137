import { useEffect } from "react";
import { useIngredient } from "../../../hooks/useIngredient";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export default function CookSingleIngredient() {
    const { ingredient_id } = useParams();
    const { fetchCookSingleIngredient } = useIngredient();
    const { store } = useGlobalReducer();

    useEffect(() => {
        fetchCookSingleIngredient(ingredient_id);
    }, [ingredient_id]);

    if (!store.singleIngredient) return <p className="text-center mt-5">Cargando...</p>;

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <img src={store.singleIngredient.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                <div className="card-body">
                    <h1 className="h4">{store.singleIngredient.name}</h1>
                    <Link to="/cook_ingredients" className="btn btn-outline-secondary">Back to ingredients</Link>
                </div>
            </div>

        </div>
    );
}
