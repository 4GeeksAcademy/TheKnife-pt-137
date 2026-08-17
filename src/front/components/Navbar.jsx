import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

const identifyOptions = [
	{ title: "Chef", register: "/chef_register", login: "/chef_login" },
	{ title: "Cocinero", login: "/cook_login" },
	{ title: "Camarero", login: "/waiter_login" },
	{ title: "Host", login: "/host_login" },
	{ title: "Cliente", register: "/client_register", login: "/client_login" },
];

const sessionTokens = ["cheftoken", "cooktoken", "waitertoken", "hosttoken", "clienttoken", "managertoken"];
const FULL_NAVBAR_PATHS = ["/", "/about"];

const Logo = () => (
	<Link to="/" className="text-decoration-none">
		<span className="navbar-brand mb-0 h1 text-white">
			<span className="me-2">🔪</span>The Knife
		</span>
	</Link>
);

export const Navbar = () => {
	// useLocation forces a re-check of path + localStorage on every route change (login/logout always navigate).
	const location = useLocation();
	const isLoggedIn = sessionTokens.some((key) => !!localStorage.getItem(key));
	const isFullNavbarPath = FULL_NAVBAR_PATHS.includes(location.pathname);

	if (!isFullNavbarPath && !isLoggedIn) {
		return null;
	}

	// Logged in on any other page: show only the logo, linking back to Home.
	if (!isFullNavbarPath) {
		return (
			<nav className="navbar navbar-dark tk-navbar py-3">
				<div className="container">
					<Logo />
				</div>
			</nav>
		);
	}

	return (
		<nav className="navbar navbar-dark tk-navbar py-3">
			<div className="container">
				<Logo />
				<div className="ml-auto d-flex gap-4 align-items-center">
					<Link to="/" className="text-white text-decoration-none">
						<span>Inicio</span>
					</Link>
					<Link to="/about" className="text-white text-decoration-none">
						<span>Sobre Nosotros</span>
					</Link>
					{!isLoggedIn && (
						<div className="dropdown">
							<button
								id="tk-identify-menu"
								type="button"
								className="btn tk-btn-primary dropdown-toggle"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								¡Identifícate!
							</button>
							<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="tk-identify-menu">
								{identifyOptions.map((option, index) => (
									<Fragment key={option.title}>
										{index > 0 && (
											<li>
												<hr className="dropdown-divider" />
											</li>
										)}
										<li>
											<h6 className="dropdown-header">{option.title}</h6>
										</li>
										{option.register && (
											<li>
												<Link className="dropdown-item" to={option.register}>Registrarse</Link>
											</li>
										)}
										<li>
											<Link className="dropdown-item" to={option.login}>Iniciar Sesión</Link>
										</li>
									</Fragment>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};
