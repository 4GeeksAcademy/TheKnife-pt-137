import React, { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useCook } from "../../hooks/useCook";

const Cooks = () => {

    const { getCooks, deleteCook } = useCook();
    const { store } = useGlobalReducer();

    useEffect(() => {
        getCooks();
    }, []);

    const cooksList = store.cooks.map((cook) => {
        return <div key={cook.id} className="waiter d-flex align-items-center gap-3">
            <span>Name: {cook.name}</span>
            <span>Email: {cook.email}</span>
            <button className="btn btn-danger" onClick={() => deleteCook(cook.id)}>Delete cook</button>
            <Link to={`/edit_cook/${cook.id}`}><button className="btn btn-warning">Edit cook</button></Link>
            <Link to={`/single_cook/${cook.id}`}><button className="btn btn-primary">View cook</button></Link>
        </div>
    })

    return (
        <div className="waiter_page d-flex flex-column align-items-center gap-3 mt-4">
            <Link to="/create_cook"><button className="btn btn-primary">Add cook</button></Link>
            <Link to="/cook_login"><button className="btn btn-success">Cook login</button></Link>
            <div className="waiters d-flex flex-column  align-items-center gap-2">
                <h1>Cooks</h1>
                {cooksList}
            </div>
        </div>
    )
}

export default Cooks;