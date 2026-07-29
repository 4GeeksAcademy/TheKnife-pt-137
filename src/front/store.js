export const initialStore=()=>{
  return{
    products: [],
    singleProduct: {},
    recipes: [], 
    single_recipe: {},
    restaurants: [],
    singleRestaurant: {},
    waiters: [],
    singleWaiter: {},
    orders: [],
    singleOrder: {},
    chefs: [],
    singleChef: {}
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case "set_single_product":
      return {
        ...store,
        singleProduct: action.payload
      }
    case "set_products":
      return {
        ...store,
        products: action.payload
      }
    case "set_recipes":
      return {
        ...store, 
        recipes: action.payload
      } 
    case "set_single_recipe":
      return {
        ...store, 
        single_recipe: action.payload
      }
    case "set_restaurants":
      return {
        ...store, 
        restaurants: action.payload
      } 
      case "set_single_restaurant":
      return {
        ...store, 
        singleRestaurant: action.payload
      }
    case "set_waiters":
      return {
        ...store, 
        waiters: action.payload
      }
      case "set_single_waiter":
      return {
        ...store, 
        singleWaiter: action.payload
      }
    case "set_orders":
      return {
        ...store, 
        orders: action.payload
      }
    case "set_single_order":
      return {
        ...store, 
        singleOrder: action.payload
      }
    case "set_chefs":
      return {
        ...store, 
        chefs: action.payload
      }
    case "set_single_chef":
      return {
        ...store, 
        singleChef: action.payload
      }
    default:
      return store;
  }    
}
