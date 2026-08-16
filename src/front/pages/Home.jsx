import { Link } from "react-router-dom";

const features = [
    {
        icon: "fa-store",
        title: "Multi-Restaurant Management",
        text: "Chefs can register and manage several restaurants, recipes and menus from a single account.",
    },
    {
        icon: "fa-utensils",
        title: "Real-Time Kitchen Orders",
        text: "Cooks and waiters stay in sync, from the moment an order is placed until it reaches the table.",
    },
    {
        icon: "fa-calendar-check",
        title: "Online Reservations",
        text: "Clients book a table in seconds and hosts confirm reservations in real time.",
    },
    {
        icon: "fa-user-shield",
        title: "Role-Based Access",
        text: "Every team member — chef, cook, waiter, host or client — gets exactly the tools they need.",
    },
];

const roles = [
    {
        icon: "fa-user-tie",
        title: "Chef",
        text: "Manage your restaurant, recipes, products and staff from one dashboard.",
        register: "/chef_register",
        login: "/chef_login",
    },
    {
        icon: "fa-kitchen-set",
        title: "Cook",
        text: "Access your assigned recipes and keep track of kitchen orders.",
        login: "/cook_login",
    },
    {
        icon: "fa-bell-concierge",
        title: "Waiter",
        text: "Manage tables and add products to active orders on the floor.",
        login: "/waiter_login",
    },
    {
        icon: "fa-door-open",
        title: "Host",
        text: "Handle walk-in and online reservations with ease.",
        login: "/host_login",
    },
    {
        icon: "fa-user",
        title: "Client",
        text: "Discover restaurants nearby and book your table online.",
        register: "/client_register",
        login: "/client_login",
    },
];

export const Home = () => {
    return (
        <div className="tk-home">
            {/* Hero */}
            <div className="tk-hero py-5">
                <div className="container py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 text-center text-lg-start">
                            <h1 className="display-4 text-white mb-3">
                                Enjoy Great Food,<br />Managed Simply
                            </h1>
                            <p className="text-white-50 mb-4 pb-2">
                                The Kinif brings chefs, cooks, waiters, hosts and clients together
                                on one platform, so every restaurant runs smoothly from the kitchen to the table.
                            </p>
                            <a href="#roles" className="btn tk-btn-primary btn-lg px-4 me-3">Get Started</a>
                            <Link to="/client_register" className="btn btn-outline-light btn-lg px-4">Join as Client</Link>
                        </div>
                        <div className="col-lg-6 text-center">
                            <img
                                className="img-fluid rounded-4 shadow"
                                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80"
                                alt="Delicious food ready to serve"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="container py-5">
                <div className="row g-4">
                    {features.map((f) => (
                        <div className="col-lg-3 col-sm-6" key={f.title}>
                            <div className="tk-card-item text-center p-4">
                                <i className={`fa-solid ${f.icon} fa-3x mb-4`} style={{ color: "var(--tk-primary)" }}></i>
                                <h5>{f.title}</h5>
                                <p className="mb-0">{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* About */}
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <div className="row g-3">
                            <div className="col-6 text-start">
                                <img className="img-fluid tk-about-img w-100" src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80" alt="Restaurant interior" />
                            </div>
                            <div className="col-6 text-start">
                                <img className="img-fluid tk-about-img w-75" style={{ marginTop: "25%" }} src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80" alt="Pizza" />
                            </div>
                            <div className="col-6 text-end">
                                <img className="img-fluid tk-about-img w-75" src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80" alt="Burger" />
                            </div>
                            <div className="col-6 text-end">
                                <img className="img-fluid tk-about-img w-100" src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80" alt="Pan with food" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h5 className="tk-section-title text-start" style={{ color: "var(--tk-primary)" }}>About Us</h5>
                        <h1 className="mb-4">
                            Welcome to <i className="fa-solid fa-utensils me-2" style={{ color: "var(--tk-primary)" }}></i>The Kinif
                        </h1>
                        <p className="mb-4">
                            The Kinif is a restaurant management platform built to connect every part of a
                            restaurant's daily operations, from the kitchen to the front of house.
                        </p>
                        <p className="mb-4">
                            Chefs organize recipes and staff, cooks and waiters coordinate every order,
                            hosts manage the floor, and clients discover restaurants and book a table in a few clicks.
                        </p>
                        <div className="row g-4 mb-4">
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center tk-counter px-3">
                                    <h1 className="flex-shrink-0 display-5 mb-0" style={{ color: "var(--tk-primary)" }}>5</h1>
                                    <div className="ps-4">
                                        <p className="mb-0">User</p>
                                        <h6 className="text-uppercase mb-0">Roles Supported</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center tk-counter px-3">
                                    <h1 className="flex-shrink-0 display-5 mb-0" style={{ color: "var(--tk-primary)" }}>&#8734;</h1>
                                    <div className="ps-4">
                                        <p className="mb-0">Restaurants &</p>
                                        <h6 className="text-uppercase mb-0">Reservations</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a href="#roles" className="btn tk-btn-primary btn-lg px-4">Explore Roles</a>
                    </div>
                </div>
            </div>

            {/* Roles / Access */}
            <div id="roles" className="container py-5">
                <div className="text-center mb-5">
                    <h5 className="tk-section-title text-center" style={{ color: "var(--tk-primary)" }}>Join The Kinif</h5>
                    <h1>Choose Your Role</h1>
                </div>
                <div className="row g-4 justify-content-center">
                    {roles.map((role) => (
                        <div className="col-lg-4 col-md-6" key={role.title}>
                            <div className="tk-card-item text-center p-4">
                                <i className={`fa-solid ${role.icon} fa-3x mb-3`} style={{ color: "var(--tk-primary)" }}></i>
                                <h5>{role.title}</h5>
                                <p className="mb-3">{role.text}</p>
                                <div className="d-flex justify-content-center gap-2">
                                    {role.register && (
                                        <Link to={role.register} className="btn tk-btn-primary btn-sm">Register</Link>
                                    )}
                                    <Link to={role.login} className="btn btn-outline-dark btn-sm">Login</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="tk-footer text-light pt-5 mt-5">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-4 col-md-6">
                            <h4 className="tk-footer-title mb-3">The Kinif</h4>
                            <p className="text-white-50">
                                A restaurant management platform connecting chefs, cooks, waiters,
                                hosts and clients — built as a 4Geeks Academy student project.
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <h4 className="tk-footer-title mb-3">Quick Links</h4>
                            <div className="d-flex flex-column">
                                <a href="#roles">Choose Your Role</a>
                                <Link to="/client_register">Client Register</Link>
                                <Link to="/chef_register">Chef Register</Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <h4 className="tk-footer-title mb-3">Access</h4>
                            <div className="d-flex flex-column">
                                <Link to="/chef_login">Chef Login</Link>
                                <Link to="/cook_login">Cook Login</Link>
                                <Link to="/waiter_login">Waiter Login</Link>
                                <Link to="/host_login">Host Login</Link>
                                <Link to="/client_login">Client Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="border-top py-4 text-center text-white-50" style={{ borderColor: "rgba(255,255,255,.1)" }}>
                        &copy; {new Date().getFullYear()} The Kinif. Built as a 4Geeks Academy student project.
                    </div>
                </div>
            </footer>
        </div>
    );
};
