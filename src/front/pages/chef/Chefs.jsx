import React, { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useChef } from "../../hooks/useChef";

const Chefs = () => {

    const { getChefs, deleteChef } = useChef()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getChefs()
    }, [])

    const chefsList = store.chefs.map((chef) => {
        return <div key={chef.id} className="chef d-flex align-items-center gap-3">
            <span>Name: {chef.name}</span>
            <span>Email: {chef.email}</span>
            <span>restaurant id: {chef.restaurant_id}</span>
            <button className="btn btn-danger" onClick={() => deleteChef(chef.id)}>Delete chef</button>
            <Link to={`/edit_chef/${chef.id}`}><button className="btn btn-warning">Edit chef</button></Link>
            <Link to={`/single_chef/${chef.id}`}><button className="btn btn-primary">View chef</button></Link>
        </div>
    })

    return (
        <div className="chef_page d-flex flex-column align-items-center gap-3 mt-4">
            <Link to="/create_chef"><button className="btn btn-primary">Add chef</button></Link>
            <div className="chefs d-flex flex-column  align-items-center gap-2">
                <h1>chefs</h1>
                {chefsList}
            </div>
        </div>
    )
}

export default Chefs;