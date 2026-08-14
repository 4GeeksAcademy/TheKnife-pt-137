import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useChef } from "../../hooks/useChef";
import LoadingComponent from "../../components/LoadingComponent";

const Chefs = () => {

    const { getChefs, deleteChef } = useChef()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getChefs().finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const chefsList = store.chefs.map((chef) => {
        return <tr key={chef.id}>
            <td>{chef.name}</td>
            <td>{chef.email}</td>
            <td>{chef.restaurant_id}</td>
            <td>{chef.restaurant_name}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteChef(chef.id)}>Delete</button>
                <Link to={`/edit_chef/${chef.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_chef/${chef.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="chef_page container py-4">
            <div className="d-flex gap-2 mb-4">
                <Link to="/create_chef"><button className="btn btn-primary">Add chef</button></Link>
                <Link to="/chef_login"><button className="btn btn-success">Chef login</button></Link>
                <Link to="/chef_dashboard"><button className="btn btn-dark">Chef dashboard</button></Link>
            </div>
            <h1 className="h4 mb-3">Chefs</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Restaurant ID</th>
                        <th>Restaurant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {chefsList}
                </tbody>
            </table>
        </div>
    )
}

export default Chefs;