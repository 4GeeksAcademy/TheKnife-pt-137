import { useEffect } from "react";
import { useIngredient } from "../../hooks/useIngredient";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export default function Ingredients() {
    const { fetchIngredients, removeIngredient } = useIngredient();
    const { store } = useGlobalReducer();

    useEffect(() => {
        fetchIngredients();
    }, []);

    useEffect(() => {
        console.log(store.ingredients);
    }, [store.ingredients]);

    const ingredients = store.ingredients.map((ingredient) => {
        return <li key={ingredient.id}>
            name: {ingredient.name}
            <Link to={`/ingredients/${ingredient.id}`}>Ver</Link>
            <Link to={`/ingredients/edit/${ingredient.id}`}>Editar</Link>
            <button onClick={() => removeIngredient(ingredient.id)}>Eliminar</button>
        </li>
    })

    return (
        <div>
            <h1>Ingredientes</h1>

            <Link to="/ingredients/create">Crear ingrediente</Link>

            <ul>
                {ingredients}
            </ul>
        </div>
    );
}
