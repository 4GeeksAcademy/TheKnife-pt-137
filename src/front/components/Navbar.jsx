import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">CocinApp</span>
				</Link>
				<div className="ml-auto">
					<Link to="/products">
						<button className="btn btn-primary">Product CRUD</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};