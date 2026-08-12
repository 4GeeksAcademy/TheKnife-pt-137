import { Navigate } from "react-router-dom";

// Protege en el cliente las rutas exclusivas del cliente.
// Si no hay "clienttoken" en localStorage redirige a /client_login.
// Ojo: esto es solo UX, la protección real está en el backend (jwt_required + role == "client").
export const ClientRoute = ({ children }) => {
    const clientLogged = !!localStorage.getItem("clienttoken");
    if (!clientLogged) {
        return <Navigate to="/client_login" replace />;
    }
    return children;
};
