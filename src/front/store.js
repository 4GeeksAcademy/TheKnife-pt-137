export const initialStore=()=>{
  return{
    singleProduct: {},
    products: [],
    recipes: [], 
    single_recipe: {},
    restaurants: [],
    singleRestaurant: {}, 
    ingredients: [],
    singleIngredient: {}
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
    case "set_ingredients":
      return {
        ...store,
        ingredients: action.payload
      }
    case "set_single_ingredient":
      return {
        ...store,
        singleIngredient: action.payload
      }
    default:
      return store;
  }    
}
