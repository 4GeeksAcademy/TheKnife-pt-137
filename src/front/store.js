export const initialStore=()=>{
  return{
    singleProduct: {},
    products: []
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
    default:
      return store;
  }    
}
