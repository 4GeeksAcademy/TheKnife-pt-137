import { useEffect, useState } from "react";
import { useIngredient } from "../../hooks/useIngredient";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import LoadingComponent from "../../components/LoadingComponent";

export default function Ingredients() {
    const { fetchIngredients, removeIngredient } = useIngredient();
    const { store } = useGlobalReducer();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchIngredients().finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingComponent />

    const ingredients = store.ingredients.map((ingredient) => {
        return <tr key={ingredient.id}>
            <td><img src={ingredient.img_url} height="50" width="50" style={{ objectFit: "cover" }} /></td>
            <td>{ingredient.name}</td>
            <td className="d-flex gap-2">
                <Link to={`/ingredients/${ingredient.id}`}><button className="btn btn-primary btn-sm">Ver</button></Link>
                <Link to={`/ingredients/edit/${ingredient.id}`}><button className="btn btn-warning btn-sm">Editar</button></Link>
                <button className="btn btn-danger btn-sm" onClick={() => removeIngredient(ingredient.id)}>Eliminar</button>
            </td>
        </tr>
    })

    return (
        <div className="ingredients_page container py-4">
            <Link to="/ingredients/create"><button className="btn btn-primary mb-4">Crear ingrediente</button></Link>
            <h1 className="h4 mb-3">Ingredientes</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients}
                </tbody>
            </table>
        </div>
    );
}
