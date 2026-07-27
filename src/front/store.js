export const initialStore=()=>{
  return{
    singleProduct: {},
    products: [],
    recipes: [], 
    single_recipe: {}
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
    default:
      return store;
  }    
}
