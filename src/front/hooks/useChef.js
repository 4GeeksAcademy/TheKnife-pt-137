// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import { getChefsService, getSingleChefService, createChefService, deleteChefService, editChefService, chefLoginService } from "../services/chefService";

export function useChef() {

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    // GET chefs
    async function getChefs() {
        try {
            const data = await getChefsService()
            dispatch({type: "set_chefs", payload: data})
        } catch (error) {console.log(error)}
    }

    // GET single chef
    async function getSingleChef(chefId) {
        try {
            const chef = await getSingleChefService(chefId)
            dispatch({type: "set_single_chef", payload: chef})

        } catch (error) {console.log(error)}
    }

    // Create chef
    async function createChef(chefData) {
        try {
            const response = await createChefService(chefData)
            const data = await response.json()
            console.log(data)
            navigate("/chefs")
        } catch(error) {console.log(error)}
    }

    // Chef login
    async function chefLogin(chefLoginData) {
        try {
            const data = await chefLoginService(chefLoginData)
            const chefToken = data.token
            localStorage.setItem("cheftoken", chefToken)
            dispatch({type: "chef_login", payload: data})
            navigate("/chef_dashboard")
        } catch (error) {console.log(error)}
    }

    // Chef logout
    function chefLogout() {
        localStorage.removeItem("cheftoken")
        dispatch({type: "chef_logout"})
        navigate("/chef_login")
    }

    // Delete chef
    async function deleteChef(chefId) {
        try {
            const message = await deleteChefService(chefId)
            console.log(message)
            getChefs()
        } catch(error) {console.log(error)}
    }

    // Edit chef
    async function editChef(chefId, chefData) {
        try {
            const response = await editChefService(chefId, chefData)
            const data = await response.json()
            console.log(data)
            navigate("/chefs")
        } catch (error) {console.log(error)}
    }

    
    return {
        getChefs,
        deleteChef,
        getSingleChef,
        createChef,
        editChef,
        chefLogin,
        chefLogout
    }
}