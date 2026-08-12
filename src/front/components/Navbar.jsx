import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">CocinApp</span>
				</Link>
				<div className="ml-auto d-flex gap-2">
					<Link to="/create_manager">
						<button className="btn btn-outline-primary">Register manager</button>
					</Link>
					<Link to="/manager_dashboard">
						<button className="btn btn-primary">Manager dashboard</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

