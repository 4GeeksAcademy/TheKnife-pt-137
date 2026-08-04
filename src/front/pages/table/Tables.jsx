import React, { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useTable } from "../../hooks/useTable";

const Tables = () => {

    const { getTables, deleteTable } = useTable()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getTables()
    }, [])

    const tablesList = store.tables.map((table) => {
        return <div key={table.id} className="table d-flex align-items-center gap-3">
            <span>number: {table.number}</span>
            <span>status: {table.status}</span>
            <span>restaurant: {table.restaurant_name}</span>
            <button className="btn btn-danger" onClick={() => deleteTable(table.id)}>Delete table</button>
            <Link to={`/edit_table/${table.id}`}><button className="btn btn-warning">Edit table</button></Link>
            <Link to={`/single_table/${table.id}`}><button className="btn btn-primary">View table</button></Link>
        </div>
    })

    return (
        <div className="table_page d-flex flex-column align-items-center gap-3 mt-4">
            <Link to="/create_table"><button className="btn btn-primary">Add table</button></Link>
            <div className="tables d-flex flex-column  align-items-center gap-2">
                <h1>tables</h1>
                {tablesList}
            </div>
        </div>
    )
}

export default Tables;