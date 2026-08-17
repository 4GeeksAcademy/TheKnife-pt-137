import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const getVisiblePlateCount = () => {
    const width = window.innerWidth;
    if (width < 576) return 1;
    if (width < 768) return 2;
    if (width < 992) return 3;
    return 4;
};

const RESTAURANT_NAME = "Casa Pepe";

const plates = [
    { src: "https://res.cloudinary.com/r2lk2eps/image/upload/v1786812567/tshq2m7w0nczwfuypfch.jpg", alt: "Paella de Mariscos" },
    { src: "https://res.cloudinary.com/r2lk2eps/image/upload/v1786812831/gaikhrzlntyehlypmewy.jpg", alt: "Tortilla Española" },
    { src: "https://res.cloudinary.com/r2lk2eps/image/upload/v1786812845/wlwwonh26eyxywdpe9t6.jpg", alt: "Gazpacho Andaluz" },
    { src: "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813111/fe8vsryi3brosrxcjenl.jpg", alt: "Pulpo a la Gallega" },
    { src: "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813340/q23kjgqnj9atjtezeqzw.jpg", alt: "Jamón Ibérico con Pan de Cristal" },
    { src: "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813353/cb0wzfzue0oqi6wifgri.jpg", alt: "Ensaladilla Rusa" },
    { src: "https://res.cloudinary.com/r2lk2eps/image/upload/v1786813704/evhjtku6wyhfocxkznux.jpg", alt: "Chuletillas de Cordero" },
    { src: "https://res.cloudinary.com/r2lk2eps/image/upload/v1786954337/jk8jbpxwmbvb5ksou5da.avif", alt: "Ensalada con aguacate" },
];

const features = [
    {
        icon: "fa-store",
        title: "Gestión Multi-Restaurante",
        text: "Los chefs pueden registrar y gestionar sus restaurantes.",
    },
    {
        icon: "fa-utensils",
        title: "Pedidos de Cocina en Tiempo Real",
        text: "Cocineros y camareros se mantienen sincronizados, desde que se hace un pedido hasta que llega a la mesa.",
    },
    {
        icon: "fa-calendar-check",
        title: "Reservas Online",
        text: "Los clientes reservan una mesa en segundos y los hosts confirman las reservas en tiempo real.",
    },
    {
        icon: "fa-user-shield",
        title: "Acceso Basado en Roles",
        text: "Cada miembro del equipo —chef, cocinero, camarero, host o cliente— obtiene exactamente las herramientas que necesita.",
    },
];

const roles = [
    { title: "Chef", register: "/chef_register", login: "/chef_login" },
    { title: "Cocinero", login: "/cook_login" },
    { title: "Camarero", login: "/waiter_login" },
    { title: "Host", login: "/host_login" },
    { title: "Cliente", register: "/client_register", login: "/client_login" },
];

export const Home = () => {
    const [plateIndex, setPlateIndex] = useState(0);
    const [visiblePlateCount, setVisiblePlateCount] = useState(getVisiblePlateCount);
    const maxPlateIndex = Math.max(0, plates.length - visiblePlateCount);

    useEffect(() => {
        const handleResize = () => setVisiblePlateCount(getVisiblePlateCount());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setPlateIndex((i) => Math.min(i, maxPlateIndex));
    }, [maxPlateIndex]);

    const showPrevPlate = () => setPlateIndex((i) => Math.max(0, i - 1));
    const showNextPlate = () => setPlateIndex((i) => Math.min(maxPlateIndex, i + 1));

    return (
        <div className="tk-home">
            {/* Hero */}
            <div className="tk-hero py-5">
                <div className="container py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 text-center text-lg-start">
                            <h1 className="display-4 text-white mb-3">
                                Disfruta de Buena Comida,<br />Gestionada de Forma Simple
                            </h1>
                            <p className="text-white-50 mb-4 pb-2">
                                The Knife reúne a chefs, cocineros, camareros, hosts y clientes
                                en una sola plataforma, para que cada restaurante funcione sin problemas desde la cocina hasta la mesa.
                            </p>
                            <a href="#platos" className="btn tk-btn-primary btn-lg px-4 me-3">Comenzar</a>
                            <Link to="/client_register" className="btn btn-outline-light btn-lg px-4">Unirme como Cliente</Link>
                        </div>
                        <div className="col-lg-6 text-center">
                            <div className="tk-flip-card">
                                <div className="tk-flip-card-inner">
                                    <div
                                        className="tk-flip-card-front"
                                        style={{ backgroundImage: "url(https://i.pinimg.com/736x/2c/6d/2e/2c6d2ed23501ef1324609d563b36810f.jpg)" }}
                                    ></div>
                                    <div
                                        className="tk-flip-card-back"
                                        style={{ backgroundImage: "url(https://i.pinimg.com/736x/14/37/cc/1437cc97509a1665f0aba65bb2ac5304.jpg)" }}
                                    ></div>
                                </div>
                            </div>
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

            {/* Plates carousel */}
            <section id="platos" className="tk-plates-section">
                <h2 className="tk-plates-title text-center">¿Qué te apetece hoy?</h2>
                <div className="container">
                    <div className="tk-plates-viewport">
                        <button
                            type="button"
                            className="tk-plates-arrow"
                            onClick={showPrevPlate}
                            disabled={plateIndex === 0}
                            aria-label="Plato anterior"
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <div className="tk-plates-clip">
                            <div
                                className="tk-plates-track"
                                style={{ transform: `translateX(calc(var(--tk-carousel-step) * ${-plateIndex}))` }}
                            >
                                {plates.map((plate) => (
                                    <div className="tk-plates-item" key={plate.src}>
                                        <div className="tk-plate-flip">
                                            <div className="tk-plate-flip-inner">
                                                <div
                                                    className="tk-plate-flip-front"
                                                    role="img"
                                                    aria-label={plate.alt}
                                                    style={{ backgroundImage: `url(${plate.src})` }}
                                                ></div>
                                                <div className="tk-plate-flip-back">
                                                    <span>{RESTAURANT_NAME}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="tk-plates-arrow"
                            onClick={showNextPlate}
                            disabled={plateIndex === maxPlateIndex}
                            aria-label="Siguiente plato"
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* Roles / Access */}
            <div id="roles" className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="tk-roles-title mb-0">Elige Tu Rol</h2>
                </div>
                <div className="row g-4 justify-content-center">
                    {roles.map((role) => (
                        <div className="col-6 col-md-4 col-lg-2" key={role.title}>
                            <div className="tk-role-card text-center p-4">
                                <h5 className="mb-4">{role.title}</h5>
                                <div className="d-flex flex-column gap-2">
                                    {role.register && (
                                        <Link to={role.register} className="btn btn-light btn-sm">Regístrate</Link>
                                    )}
                                    <Link to={role.login} className="btn btn-outline-light btn-sm">Entrar</Link>
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
                            <h4 className="tk-footer-title mb-3">The Knife</h4>
                            <p className="text-white-50">
                                Una plataforma de gestión de restaurantes que conecta a chefs, cocineros, camareros,
                                hosts y clientes — creada como proyecto de estudiante de 4Geeks Academy.
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <h4 className="tk-footer-title mb-3">Enlaces Rápidos</h4>
                            <div className="d-flex flex-column">
                                <Link to="/client_register">Registro de Cliente</Link>
                                <Link to="/chef_register">Registro de Chef</Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <h4 className="tk-footer-title mb-3">Acceso</h4>
                            <div className="d-flex flex-column">
                                <Link to="/chef_login">Inicio de Sesión de Chef</Link>
                                <Link to="/cook_login">Inicio de Sesión de Cocinero</Link>
                                <Link to="/waiter_login">Inicio de Sesión de Camarero</Link>
                                <Link to="/host_login">Inicio de Sesión de Host</Link>
                                <Link to="/client_login">Inicio de Sesión de Cliente</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="border-top py-4 text-center text-white-50" style={{ borderColor: "rgba(255,255,255,.1)" }}>
                        &copy; {new Date().getFullYear()} The Knife. Creado como proyecto de estudiante de 4Geeks Academy.
                    </div>
                </div>
            </footer>
        </div>
    );
};
