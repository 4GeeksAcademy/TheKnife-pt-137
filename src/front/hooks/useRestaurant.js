// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import { getRestaurantsService, getSingleRestaurantService, createRestaurantService, deleteRestaurantService, editRestaurantService, chefCreateRestaurantService, chefEditRestaurantService, chefGetRestaurantService } from "../services/restaurantService";

export function useRestaurant() {

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    // GET restaurants
    async function getRestaurants() {
        try {
            const data = await getRestaurantsService()
            dispatch({type: "set_restaurants", payload: data})
        } catch (error) {console.log(error)}
    }

    // GET single restaurant
    async function getSingleRestaurant(restaurantId) {
        try {
            const restaurant = await getSingleRestaurantService(restaurantId)
            dispatch({type: "set_single_restaurant", payload: restaurant})

        } catch (error) {console.log(error)}
    }

    // Create restaurant
    async function createRestaurant(restaurantData) {
        try {
            const response = await createRestaurantService(restaurantData)
            const data = await response.json()
            console.log(data)
            navigate("/restaurants")
        } catch(error) {console.log(error)}
    }

    // Delete restaurant
    async function deleteRestaurant(restaurantId) {
        try {
            const message = await deleteRestaurantService(restaurantId)
            console.log(message)
            getRestaurants()
        } catch(error) {console.log(error)}
    }

    // Edit restaurant
    async function editRestaurant(restaurantId, restaurantData) {
        try {
            const response = await editRestaurantService(restaurantId, restaurantData)
            const data = await response.json()
            console.log(data)
            navigate("/restaurants")
        } catch (error) {console.log(error)}
    }

    /////////////////////////////////////////////////////////////
    // Chef get his restaurant
    // GET single restaurant
    async function chefGetRestaurant(restaurant_id) {
        try {
            const restaurant = await chefGetRestaurantService(restaurant_id)
            dispatch({type: "set_single_restaurant", payload: restaurant})
        } catch (error) {console.log(error)}
    }

    // Chef creates his restaurant
    async function chefCreateRestaurant(restaurantData) {
        try {
            const response = await chefCreateRestaurantService(restaurantData)
            const data = await response.json()
            console.log(data)
            navigate("/chef_dashboard")
        } catch (error) {console.log(error)}
    }

    // Chef edit his restaurant
    async function chefEditRestaurant(restaurant_id, restaurantData) {
        try {
            const response = await chefEditRestaurantService(restaurant_id, restaurantData)
            const data = await response.json()
            console.log(data)
            navigate("/chef_dashboard")
            chefGetRestaurant(restaurant_id)
        } catch (error) {console.log(error)}
    }

    
    return {
        getRestaurants,
        deleteRestaurant,
        getSingleRestaurant,
        createRestaurant,
        editRestaurant,
        chefCreateRestaurant,
        chefEditRestaurant
    }
}