import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useChef } from "../hooks/useChef"
import { useCook } from "../hooks/useCook"
import { useWaiter } from "../hooks/useWaiter"
import ChefSidebar from "../pages/chef/ChefSidebar"
import CookSidebar from "../pages/cook/CookSidebar"
import WaiterSidebar from "../pages/waiter/WaiterSidebar"

const ROLE_CONFIG = {
    chef: { Sidebar: ChefSidebar, shellClass: "chef-shell", mainClass: "chef-main", loginPath: "/chef_login" },
    cook: { Sidebar: CookSidebar, shellClass: "cook-shell", mainClass: "cook-main", loginPath: "/cook_login" },
    waiter: { Sidebar: WaiterSidebar, shellClass: "waiter-shell", mainClass: "waiter-main", loginPath: "/waiter_login" },
}

// Algunas páginas son compartidas por varios roles (ej. el detalle de una
// receta lo puede ver tanto el chef como el cocinero), así que no pueden
// colgar de un único <XLayout>. Este componente detecta cuál de los roles
// permitidos está logueado en este navegador y muestra su sidebar habitual,
// para que esas vistas compartidas nunca se queden sin la barra lateral.
export const RoleAwareLayout = ({ roles }) => {
    const { store } = useGlobalReducer()
    const { rehydrateChef } = useChef()
    const { rehydrateCook } = useCook()
    const { rehydrateWaiter } = useWaiter()

    const activeRole = roles.find((role) => !!localStorage.getItem(`${role}token`))

    useEffect(() => {
        if (activeRole === "chef" && !store.loggedChef.chef.id) rehydrateChef()
        if (activeRole === "cook" && !store.loggedCook.cook.id) rehydrateCook()
        if (activeRole === "waiter" && !store.loggedWaiter.waiter.id) rehydrateWaiter()
    }, [activeRole])

    if (!activeRole) {
        return <Navigate to={ROLE_CONFIG[roles[0]].loginPath} replace />
    }

    const { Sidebar, shellClass, mainClass } = ROLE_CONFIG[activeRole]

    return (
        <div className={`${shellClass} d-flex flex-column flex-lg-row`}>
            <Sidebar />
            <main className={`${mainClass} flex-grow-1`}>
                <Outlet />
            </main>
        </div>
    )
}

export default RoleAwareLayout
