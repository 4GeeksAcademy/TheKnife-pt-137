import React, { useState, useEffect } from "react";
import { useTable } from "../../hooks/useTable";
import { Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CreateTableForm = () => {

    const [tableData, setTableData] = useState({ number: 0, status: "", location: "", restaurant_id: "" });
    const { store } = useGlobalReducer()
    const { getRestaurants } = useRestaurant()
    const { createTable } = useTable();

    useEffect(() => {
        getRestaurants()
    }, [])

    const restaurantsList = store.restaurants.map((restaurant) => {
        return <option value={restaurant.id} key={restaurant.id}>{restaurant.name}</option>
    })

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new table</div>
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

                    <div className="mb-3">
                        <label className="form-label" htmlFor="restaurantid">Restaurant</label>
                        <select className="form-select" onChange={(e)=>setTableData({...tableData, restaurant_id: e.target.value})} value={tableData.restaurant_id} name="restaurantid" id="restaurantid">
                            <option value="">Select a restaurant</option>
                            {restaurantsList}
                        </select>
                    </div>

                    <button onClick={() => createTable(tableData)} className="btn btn-primary w-100 mb-3">Create new table</button>

                    <div className="text-center">
                        <Link to="/tables">Back to tables</Link>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default CreateTableForm;