import { Navigate } from "react-router-dom";

// Protege en el cliente las rutas del CRUD genérico del manager.
// Si no hay "managertoken" en localStorage redirige a /manager_login.
// Ojo: esto es solo UX, la protección real está en el backend (jwt_required + role == "manager").
export const ManagerRoute = ({ children }) => {
    const managerLogged = !!localStorage.getItem("managertoken");
    if (!managerLogged) {
        return <Navigate to="/manager_login" replace />;
    }
    return children;
};
