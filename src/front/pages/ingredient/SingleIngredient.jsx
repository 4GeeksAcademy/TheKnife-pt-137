import { useEffect } from "react";
import { useIngredient } from "../../hooks/useIngredient";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export default function SingleIngredient() {
    const { ingredient_id } = useParams();
    const { fetchSingleIngredient } = useIngredient();
    const { store } = useGlobalReducer();

    useEffect(() => {
        fetchSingleIngredient(ingredient_id);
    }, []);

    if (!store.singleIngredient) return <p>Cargando...</p>;

    return (
        <div>
            <h1>{store.singleIngredient.name}</h1>
            <p>Estado: {store.singleIngredient.active ? "Activo" : "Inactivo"}</p>
            <img src={store.singleIngredient.img_url} height="300" width="350" />
        </div>
    );
}
