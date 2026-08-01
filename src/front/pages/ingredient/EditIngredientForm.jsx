import React, { useEffect, useState } from "react";
import { useIngredient } from "../../hooks/useIngredient";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useCloudinary } from "../../hooks/useCloudinary";
import { Link } from "react-router-dom";

const EditIngredientForm = () => {

    const { store } = useGlobalReducer();
    const [ingredientData, setIngredientData] = useState({ name: "", active: false, img_url: "" });
    const { fetchSingleIngredient, updateIngredient } = useIngredient();
    const { ingredient_id } = useParams();
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        fetchSingleIngredient(ingredient_id);
    }, []);

    useEffect(() => {
        if (store.singleIngredient?.id) {
            setIngredientData({
                name: store.singleIngredient.name,
                active: store.singleIngredient.active
            });
        }
    }, [store.singleIngredient]);

    return (
        <div className="ingredient_form d-flex flex-column align-items-center gap-3">
            <h1>Edit ingredient</h1>

            <div>
                <label htmlFor="name">Name</label>
                <input
                    onChange={(e) => setIngredientData({ ...ingredientData, name: e.target.value })}
                    value={ingredientData.name}
                    type="text"
                    name="name"
                    id="name"
                />
            </div>

            <div>
                <label htmlFor="active">Active</label>
                <input
                    type="checkbox"
                    checked={ingredientData.active}
                    onChange={(e) => setIngredientData({ ...ingredientData, active: e.target.checked })}
                    name="active"
                    id="active"
                />
            </div>

            <input type="file" onChange={(e)=>uploadImage(e,"cocinapp_images", setIngredientData,ingredientData)}/>

            <button
                onClick={() => updateIngredient(ingredient_id, ingredientData)}
                className="btn btn-primary"
            >
                Edit ingredient
            </button>

            <Link to="/ingredients">Back to ingredients</Link>
        </div>
    );
};

export default EditIngredientForm;
