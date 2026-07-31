export const initialStore = () => {
  return {
    products: [],
    singleProduct: {},
    recipes: [],
    single_recipe: {},
    restaurants: [],
    singleRestaurant: {}, 
    ingredients: [],
    singleIngredient: {},
    cooks: [],
    singleCook: {},
    loggedCook: {
      cookAuth: false,
      cook: {},
      restaurant: "",
    },
    waiters: [],
    singleWaiter: {},
    orders: [],
    singleOrder: {},
    chefs: [],
    singleChef: {},
    loggedChef: {
      chefAuth: false,
      chef: {},
      restaurant: "",
    },
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_single_product":
      return {
        ...store,
        singleProduct: action.payload,
      };
    case "set_products":
      return {
        ...store,
        products: action.payload,
      };
    case "set_recipes":
      return {
        ...store,
        recipes: action.payload,
      };
    case "set_single_recipe":
      return {
        ...store,
        single_recipe: action.payload,
      };
    case "set_restaurants":
      return {
        ...store,
        restaurants: action.payload,
      };
    case "set_single_restaurant":
      return {
        ...store, 
        singleRestaurant: action.payload
      }
    case "set_cooks":
      return {
        ...store,
        cooks: action.payload
      }
    case "set_single_cook":
      return {
        ...store, 
        singleCook: action.payload
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
    case "set_waiters":
      return {
        ...store,
        waiters: action.payload,
      };
    case "set_single_waiter":
      return {
        ...store,
        singleWaiter: action.payload,
      };
    case "set_orders":
      return {
        ...store,
        orders: action.payload,
      };
    case "set_single_order":
      return {
        ...store,
        singleOrder: action.payload,
      };
    case "set_chefs":
      return {
        ...store,
        chefs: action.payload,
      };
    case "set_single_chef":
      return {
        ...store,
        singleChef: action.payload
      };
      case "chef_login":
      return {
        ...store,
        loggedChef: {
          chefAuth: true,
          chef: action.payload.chef,
          restaurant: action.payload.chef_restaurant,
        },
      };
      case "cook_login":
      return {
        ...store,
        loggedCook: {
          cookAuth: true,
          cook: action.payload.cook,
          restaurant: action.payload.restaurant
        },
      };
      case "cook_logout":
        return {
          ...store,
          singleCook: {
            cookAuth: false,
            cook: {},
            restaurant: ""
          }
        }
      case "chef_logout":
        return {
          ...store,
          singleChef: {
            chefAuth: false,
            chef: {},
            restaurant: ""
          }
        }
    default:
      return store;
  }
}
