import React, { useEffect, useState } from "react";
import { useTable } from "../../hooks/useTable";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EditTableForm = () => {

    const { store } = useGlobalReducer();
    const [tableData, setTableData] = useState({ number: 0, status: "", location: "" });
    const { getSingleTable, editTable } = useTable();
    const { table_id } = useParams();

    useEffect(() => {
        if (table_id) {
            getSingleTable(table_id);
        }
    }, [table_id]);

    useEffect(() => {
        if (store.singleTable?.id) {
            setTableData({
                number: store.singleTable.number || 0,
                status: store.singleTable.status || "",
                location: store.singleTable.location || ""
            });
        }
    }, [store.singleTable]);
    
    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit table</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="number">Number</label>
                        <input
                            className="form-control"
                            onChange={(e) => setTableData({ ...tableData, number: e.target.value })}
                            value={tableData.number}
                            type="number"
                            name="number"
                            id="number"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="status">Status</label>
                        <select
                            className="form-select"
                            onChange={(e) => setTableData({ ...tableData, status: e.target.value })}
                            value={tableData.status}
                            name="status"
                            id="status"
                        >
                            <option value="">Select status</option>
                            <option value="occupied">occupied</option>
                            <option value="available">available</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="location">Location</label>
                        <input
                            className="form-control"
                            onChange={(e) => setTableData({ ...tableData, location: e.target.value })}
                            value={tableData.location}
                            type="text"
                            name="location"
                            id="location"
                        />
                    </div>

                    <button onClick={() => editTable(table_id, tableData)} className="btn btn-primary w-100 mb-3">Edit table</button>

                    <div className="text-center">
                        <Link to="/tables">Back to tables</Link>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default EditTableForm;