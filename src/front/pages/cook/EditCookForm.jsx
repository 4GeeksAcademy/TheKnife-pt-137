import React, { useEffect, useState } from "react";
import { useCook } from "../../hooks/useCook";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const EditCookForm = () => {

    const { store } = useGlobalReducer();
    const [cookData, setCookData] = useState({ name: "", email: "", password: "" });
    const { getSingleCook, editCook } = useCook();
    const { cook_id } = useParams();

    useEffect(() => {
        getSingleCook(cook_id);
    }, []);
    useEffect(() => {
        if (store.singleCook.id) {
            setCookData({
                name: store.singleCook.name,
                email: store.singleCook.email,
                password: ""
            });
        }
    }, [store.singleCook]);

    return (
        <div className="cook_form d-flex flex-column align-items-center gap-3">
            <h1>Edit cook</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e) => setCookData({ ...cookData, name: e.target.value })} value={cookData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e) => setCookData({ ...cookData, email: e.target.value })} value={cookData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input onChange={(e) => setCookData({ ...cookData, password: e.target.value })} value={cookData.password} type="password" name="password" id="password" />
            </div>
            <button onClick={() => editCook(cook_id, cookData)} className="btn btn-primary">Edit cook</button>
            <Link to="/cooks">Back to cooks</Link>
        </div>
    )
}

export default EditCookForm;