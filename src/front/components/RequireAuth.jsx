import { Navigate } from "react-router-dom"

export const RequireAuth = ({role, children}) => {
    const token = !!localStorage.getItem(`${role}token`)
    if (!token) return <Navigate to={`/${role}_login`} />
    return children
}