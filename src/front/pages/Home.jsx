import React from "react"
import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="container py-5">
         <h1 className="h3 text-center mb-4">Welcome to CocinApp</h1>

         <div className="row g-4 justify-content-center">
             <div className="col-md-5">
                 <div className="card h-100">
                     <div className="card-header text-center">Chef</div>
                     <div className="card-body d-flex flex-column gap-2">
                         <Link to="/chef_register" className="btn btn-primary">Chef Register</Link>
                         <Link to="/chef_login" className="btn btn-outline-primary">Chef Login</Link>
                     </div>
                 </div>
             </div>

             <div className="col-md-5">
                 <div className="card h-100">
                     <div className="card-header text-center">Cook</div>
                     <div className="card-body d-flex flex-column gap-2">
                         <Link to="/cook_login" className="btn btn-outline-primary">Cook Login</Link>
                     </div>
                 </div>
             </div>

             <div className="col-md-5">
                 <div className="card h-100">
                     <div className="card-header text-center">Waiter</div>
                     <div className="card-body d-flex flex-column gap-2">
                         <Link to="/waiter_login" className="btn btn-outline-primary">Waiter Login</Link>
                     </div>
                 </div>
             </div>
         </div>
        </div>
    );
};