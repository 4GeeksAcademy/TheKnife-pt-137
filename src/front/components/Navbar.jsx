import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">CocinApp</span>
				</Link>
				<div className="ml-auto d-flex gap-2">
					<Link to="/products">
						<button className="btn btn-primary">Product CRUD</button>
					</Link>
					<Link to="/recipes">
						<button className="btn btn-primary">Recipes CRUD</button>
					</Link>
					<Link to="/restaurants">
						<button className="btn btn-primary">Restaurants CRUD</button>
					</Link>
					<Link to="/ingredients">
						<button className="btn btn-primary">Ingredients CRUD</button>
					</Link>
					<Link to="/waiters">
						<button className="btn btn-primary">Waiters CRUD</button>
					</Link>
					<Link to="/orders">
						<button className="btn btn-primary">Orders CRUD</button>
					</Link>
					<Link to="/chefs">
						<button className="btn btn-primary">Chefs CRUD</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

