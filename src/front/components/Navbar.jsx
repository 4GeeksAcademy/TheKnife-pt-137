import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-dark tk-navbar py-3">
			<div className="container">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mb-0 h1 text-white">
						<i className="fa-solid fa-utensils me-2"></i>The Kinif
					</span>
				</Link>
				<div className="ml-auto d-flex gap-2">
					<Link to="/create_manager">
						<button className="btn btn-outline-light">Register manager</button>
					</Link>
					<Link to="/manager_dashboard">
						<button className="btn tk-btn-primary">Manager dashboard</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

