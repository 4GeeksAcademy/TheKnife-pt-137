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
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit ingredient</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input
                            className="form-control"
                            onChange={(e) => setIngredientData({ ...ingredientData, name: e.target.value })}
                            value={ingredientData.name}
                            type="text"
                            name="name"
                            id="name"
                        />
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={ingredientData.active}
                            onChange={(e) => setIngredientData({ ...ingredientData, active: e.target.checked })}
                            name="active"
                            id="active"
                        />
                        <label className="form-check-label" htmlFor="active">Active</label>
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e)=>uploadImage(e,"cocinapp_images", setIngredientData,ingredientData)}/>
                    </div>

                    <button
                        onClick={() => updateIngredient(ingredient_id, ingredientData)}
                        className="btn btn-primary w-100 mb-3"
                    >
                        Edit ingredient
                    </button>

                    <div className="text-center">
                        <Link to="/ingredients">Back to ingredients</Link>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default EditIngredientForm;
