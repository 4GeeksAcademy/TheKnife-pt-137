import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useCook } from "../../hooks/useCook";
import { useConfirmedDelete } from "../../hooks/useConfirmedDelete"
import LoadingComponent from "../../components/LoadingComponent"

const Cooks = () => {

    const { getCooks, deleteCook } = useCook();
    const { handleDelete } = useConfirmedDelete()
    const { store } = useGlobalReducer();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getCooks().finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingComponent />

    const cooksList = store.cooks.map((cook) => {
        return <tr key={cook.id}>
            <td><img src={cook.img_url} height="50" width="50" style={{ objectFit: "cover", borderRadius: "50%" }} /></td>
            <td>{cook.name}</td>
            <td>{cook.email}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(deleteCook, cook.id)}>Delete</button>
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
                        <th></th>
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