import { useEffect } from "react";
import { useIngredient } from "../../hooks/useIngredient";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export default function SingleIngredient() {
    const { ingredient_id } = useParams();
    const { fetchSingleIngredient } = useIngredient();
    const { store } = useGlobalReducer();

    useEffect(() => {
        fetchSingleIngredient(ingredient_id);
    }, []);

    if (!store.singleIngredient) return <p className="text-center mt-5">Cargando...</p>;

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <img src={store.singleIngredient.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                <div className="card-body">
                    <h1 className="h4">{store.singleIngredient.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Estado:</strong> {store.singleIngredient.active ? "Activo" : "Inactivo"}</li>
                    </ul>
                    <Link to="/ingredients" className="btn btn-outline-secondary">Volver a ingredientes</Link>
                </div>
            </div>

        </div>
    );
}
