import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

const identifyOptions = [
	{ title: "Chef", register: "/chef_register", login: "/chef_login" },
	{ title: "Cocinero", login: "/cook_login" },
	{ title: "Camarero", login: "/waiter_login" },
	{ title: "Host", login: "/host_login" },
	{ title: "Cliente", register: "/client_register", login: "/client_login" },
];

const dashboardPaths = {
	cheftoken: "/chef_dashboard",
	cooktoken: "/cook_dashboard",
	waitertoken: "/waiter_dashboard",
	hosttoken: "/host_dashboard",
	clienttoken: "/client_dashboard",
	managertoken: "/manager_dashboard",
};
const sessionTokens = Object.keys(dashboardPaths);
const FULL_NAVBAR_PATHS = ["/", "/about"];

// Logged in: the logo links to that role's dashboard summary instead of Home.
const getLogoDestination = () => {
	const loggedInToken = sessionTokens.find((key) => !!localStorage.getItem(key));
	return loggedInToken ? dashboardPaths[loggedInToken] : "/";
};

const Logo = ({ to }) => (
	<Link to={to} className="text-decoration-none">
		<span className="navbar-brand mb-0 h1 text-white">
			<span className="me-2"><img src="/logobueno.png" alt="theknifelogo" height="50" width="50" /></span>The Knife
		</span>
	</Link>
);

export const Navbar = () => {
	// useLocation forces a re-check of path + localStorage on every route change (login/logout always navigate).
	const location = useLocation();
	const isLoggedIn = sessionTokens.some((key) => !!localStorage.getItem(key));
	const isFullNavbarPath = FULL_NAVBAR_PATHS.includes(location.pathname);
	const logoDestination = getLogoDestination();

	if (!isFullNavbarPath && !isLoggedIn) {
		return null;
	}

	// Logged in on any other page: show only the logo, linking back to their dashboard.
	if (!isFullNavbarPath) {
		return (
			<nav className="navbar navbar-dark tk-navbar py-3">
				<div className="container">
					<Logo to={logoDestination} />
				</div>
			</nav>
		);
	}

	return (
		<nav className="navbar navbar-dark tk-navbar py-3">
			<div className="container">
				<Logo to={logoDestination} />
				<div className="ml-auto d-flex gap-4 align-items-center">
					<Link to="/about" className="text-white text-decoration-none">
						<span>Sobre Nosotros</span>
					</Link>
				</div>
			</div>
		</nav>
	);
};
