import React from "react";
import { Link } from "react-router-dom";
import grazzielImg from "../assets/img/217185558graziel.jpeg"
import juanImg from "../assets/img/249479154juan.jpeg"
import emmanuelImg from "../assets/img/emmanel.jpg"

const chefs = [
  {
    name: "Grazziel Gomes",
    designation: "Desarrolladora",
    img: grazzielImg,
    github: "https://github.com/Grazziel",
  },
  {
    name: "Juan Donday Rodríguez",
    designation: "Desarrollador",
    img: juanImg,
    github: "https://github.com/jdondayr",
  },
  {
    name: "Emmanuel Rodríguez",
    designation: "Desarrollador",
    img: emmanuelImg,
    github: "https://github.com/Ejrodriguez3636",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
];

export const About = () => {
  return (
    <div className="about-page">
      {/* Page header + breadcrumb */}
      <div className="page-header text-center">
        <div className="container">
          <h1 className="display-5 mb-3">Sobre Nosotros</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Sobre Nosotros
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* About + gallery */}
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div className="row g-3 about-img" style={{ minHeight: "450px" }}>
              <div className="col-6">
                <img src={gallery[0]} alt="Plato de The Knife" className="img-tall" />
              </div>
              <div className="col-6 d-flex flex-column gap-3">
                <img src={gallery[1]} alt="Ambiente del restaurante" style={{ height: "48%" }} />
                <img src={gallery[2]} alt="Chef cocinando" style={{ height: "48%" }} />
              </div>
              <div className="col-12">
                <img src={gallery[3]} alt="Mesa servida" style={{ height: "180px" }} />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <p className="section-title">Sobre Nosotros</p>
            <h1 className="display-6 mb-4">Bienvenido a The Knife 🔪</h1>
            <p className="mb-4">
              En The Knife conectamos a los amantes de la buena comida con los
              mejores restaurantes según la ocasión. Desde una cena romántica
              hasta una celebración con amigos, te ayudamos a encontrar el lugar
              perfecto y a gestionar todo, desde la reserva hasta el último plato.
            </p>
          </div>
        </div>
      </div>

      {/* Internal management */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <p className="section-title text-center">Más Que Reservas</p>
          <h1 className="display-6">Gestión Interna del Restaurante</h1>
          <p className="mt-3 mx-auto" style={{ maxWidth: "700px" }}>
            The Knife no solo conecta clientes con restaurantes: también es la
            herramienta que usa el equipo del restaurante por dentro, para que
            cada pedido llegue a tiempo y en orden.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-3 col-sm-6">
            <div className="feature-card h-100 text-center p-4">
              <i className="fa-solid fa-receipt fa-2x mb-3"></i>
              <h5>Gestión de Pedidos</h5>
              <p className="mb-0">
                Meseros y cocina siguen cada pedido en tiempo real, desde que
                se toma en la mesa hasta que sale el plato.
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="feature-card h-100 text-center p-4">
              <i className="fa-solid fa-carrot fa-2x mb-3"></i>
              <h5>Control de Ingredientes</h5>
              <p className="mb-0">
                El chef administra recetas e inventario de ingredientes para
                que la cocina nunca se quede sin lo esencial.
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="feature-card h-100 text-center p-4">
              <i className="fa-solid fa-chair fa-2x mb-3"></i>
              <h5>Mesas y Reservas</h5>
              <p className="mb-0">
                El anfitrión organiza mesas y reservas por ocasión para que
                cada cliente tenga un lugar listo al llegar.
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="feature-card h-100 text-center p-4">
              <i className="fa-solid fa-users fa-2x mb-3"></i>
              <h5>Equipo y Roles</h5>
              <p className="mb-0">
                Cada rol (chef, cocinero, mesero, anfitrión, manager) tiene su
                propio espacio de trabajo dentro de la plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team / chefs */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <p className="section-title text-center">Nuestro Equipo</p>
          <h1 className="display-6">Nuestros Desarrolladores</h1>
        </div>

        <div className="row g-4 justify-content-center">
          {chefs.map((chef) => (
            <div className="col-lg-3 col-sm-6" key={chef.name}>
              <div className="card team-card h-100">
                <img src={chef.img} className="card-img-top" alt={chef.name} />
                <div className="card-body">
                  <h5 className="card-title mb-1">{chef.name}</h5>
                  <p className="designation mb-3">{chef.designation}</p>
                  <div className="team-social">
                    <a href={chef.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                      <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
