import React, { useState } from "react";
import { useTable } from "../../hooks/useTable";
import { Link } from "react-router-dom";

const CreateTableForm = () => {

    const [tableData, setTableData] = useState({ number: 0, status: "", location: "" });
    const { createTable } = useTable();

    return (
        <div className="table_form d-flex flex-column align-items-center gap-3">
            <h1>Create new table</h1>
            <div>
                <label htmlFor="number">Number</label>
                <input 
                    onChange={(e) => setTableData({ ...tableData, number: e.target.value })} 
                    value={tableData.number} 
                    type="number" 
                    name="number" 
                    id="number" 
                />
            </div>
            <div>
                <label htmlFor="status">Status</label>
                <select 
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
            <div>
                <label htmlFor="location">Location</label>
                <input 
                    onChange={(e) => setTableData({ ...tableData, location: e.target.value })} 
                    value={tableData.location} 
                    type="text" 
                    name="location" 
                    id="location" 
                />
            </div>
            <button onClick={() => createTable(tableData)} className="btn btn-primary">Create new table</button>
            <Link to="/tables">Back to tables</Link>
        </div>
    );
};

export default CreateTableForm;