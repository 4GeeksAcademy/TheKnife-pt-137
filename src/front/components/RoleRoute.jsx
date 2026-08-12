import { Navigate } from "react-router-dom";

const ROLE_LOGIN_PATH = {
    chef: "/chef_login",
    cook: "/cook_login",
    waiter: "/waiter_login",
    host: "/host_login",
};

// Protege en el cliente las rutas exclusivas de chef/cook/waiter/host.
// Acepta un rol único (role="chef") o varios roles válidos para páginas
// compartidas entre roles (roles={["chef", "cook"]}).
// Si ninguno de los tokens correspondientes está en localStorage, redirige
// al login del primer rol de la lista.
export const RoleRoute = ({ role, roles, children }) => {
    const allowedRoles = roles || [role];
    const isLogged = allowedRoles.some((r) => !!localStorage.getItem(`${r}token`));
    if (!isLogged) {
        return <Navigate to={ROLE_LOGIN_PATH[allowedRoles[0]]} replace />;
    }
    return children;
};
