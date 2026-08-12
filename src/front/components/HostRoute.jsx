import { Navigate } from "react-router-dom";

// Protege en el cliente la ruta del panel del host.
// Si no hay "hosttoken" en localStorage redirige a /host_login.
// Ojo: esto es solo UX, la protección real está en el backend (jwt_required + role == "host").
export const HostRoute = ({ children }) => {
    const hostLogged = !!localStorage.getItem("hosttoken");
    if (!hostLogged) {
        return <Navigate to="/host_login" replace />;
    }
    return children;
};
