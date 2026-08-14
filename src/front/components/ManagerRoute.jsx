import { Navigate } from "react-router-dom";

export const ManagerRoute = ({ children }) => {
    const managerLogged = !!localStorage.getItem("managertoken");
    if (!managerLogged) {
        return <Navigate to="/manager_login" replace />;
    }
    return children;
};
