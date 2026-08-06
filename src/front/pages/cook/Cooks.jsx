import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useCook } from "../../hooks/useCook";

const Cooks = () => {

    const { getCooks, deleteCook } = useCook();
    const { store } = useGlobalReducer();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getCooks().finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const cooksList = store.cooks.map((cook) => {
        return <tr key={cook.id}>
            <td>{cook.name}</td>
            <td>{cook.email}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteCook(cook.id)}>Delete</button>
                <Link to={`/edit_cook/${cook.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_cook/${cook.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="waiter_page container py-4">
            <div className="d-flex gap-2 mb-4">
                <Link to="/create_cook"><button className="btn btn-primary">Add cook</button></Link>
                <Link to="/cook_login"><button className="btn btn-success">Cook login</button></Link>
                <Link to="/cook_dashboard"><button className="btn btn-dark">Cook dashboard</button></Link>
            </div>
            <h1 className="h4 mb-3">Cooks</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cooksList}
                </tbody>
            </table>
        </div>
    )
}

export default Cooks;