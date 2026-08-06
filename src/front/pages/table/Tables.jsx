import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useTable } from "../../hooks/useTable";

const Tables = () => {

    const { getTables, deleteTable } = useTable()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getTables().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const tablesList = store.tables.map((table) => {
        return <tr key={table.id}>
            <td>{table.number}</td>
            <td>{table.status}</td>
            <td>{table.restaurant_name}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteTable(table.id)}>Delete</button>
                <Link to={`/edit_table/${table.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_table/${table.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="table_page container py-4">
            <Link to="/create_table"><button className="btn btn-primary mb-4">Add table</button></Link>
            <h1 className="h4 mb-3">Tables</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Status</th>
                        <th>Restaurant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tablesList}
                </tbody>
            </table>
        </div>
    )
}

export default Tables;