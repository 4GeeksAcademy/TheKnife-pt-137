import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useChef } from "../../hooks/useChef"
import ChefSidebar from "./ChefSidebar"

// Persistent shell for every chef-scoped page: sidebar stays fixed while the
// central content (Outlet) swaps between the different chef functionalities.
const ChefLayout = () => {

    const { store } = useGlobalReducer()
    const { rehydrateChef } = useChef()

    useEffect(() => {
        if (!store.loggedChef.chef.id) {
            rehydrateChef()
        }
    }, [])

    return (
        <div className="chef-shell d-flex flex-column flex-lg-row">
            <ChefSidebar />
            <main className="chef-main flex-grow-1">
                <Outlet />
            </main>
        </div>
    )
}

export default ChefLayout
