export const initialStore = () => {
  return {
    products: [],
    singleProduct: {},
    recipes: [],
    single_recipe: {},
    restaurants: [],
    singleRestaurant: {},
    managers: [],
    singleManager: {},
    loggedManager: {
      managerAuth: false,
      manager: {},
    },
    ingredients: [],
    singleIngredient: {},
    inactiveIngredients: [],
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
    orderProducts: [],
    singleOrderProduct: {},
    tables: [],
    singleTable: {},
    reservations: [],
    singleReservation: {},
    chefs: [],
    singleChef: {},
    recipeIngredients: [],
    singleRecipeIngredient: {},
    loggedChef: {
      chefAuth: false,
      chef: {},
      restaurant: "",
    },
    loggedWaiter: {
      waiterAuth: false,
      waiter: {},
      restaurant: "",
    },
    hosts: [],
    singleHost: {},
    restaurantHost: null,
    loggedHost: {
      hostAuth: false,
      host: {},
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
        singleRestaurant: action.payload,
      };
    case "set_managers":
      return {
        ...store,
        managers: action.payload,
      };
    case "set_single_manager":
      return {
        ...store,
        singleManager: action.payload,
      };
    case "manager_login":
      return {
        ...store,
        loggedManager: {
          managerAuth: true,
          manager: action.payload.manager,
        },
      };
    case "manager_logout":
      return {
        ...store,
        loggedManager: {
          managerAuth: false,
          manager: {},
        },
      };
    case "set_cooks":
      return {
        ...store,
        cooks: action.payload,
      };
    case "set_single_cook":
      return {
        ...store,
        singleCook: action.payload,
      };
    case "set_ingredients":
      return {
        ...store,
        ingredients: action.payload,
      };
    case "set_single_ingredient":
      return {
        ...store,
        singleIngredient: action.payload,
      };
    case "set_inactive_ingredients":
      return {
        ...store,
        inactiveIngredients: action.payload,
      };
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
    case "set_order_products":
      return {
        ...store,
        orderProducts: action.payload,
      };
    case "set_single_order_product":
      return {
        ...store,
        singleOrderProduct: action.payload,
      };
    case "set_tables":
      return {
        ...store,
        tables: action.payload,
      };
    case "set_single_table":
      return {
        ...store,
        singleTable: action.payload,
      };
    case "set_reservations":
      return {
        ...store,
        reservations: action.payload,
      };
    case "set_single_reservation":
      return {
        ...store,
        singleReservation: action.payload,
      };
    case "set_chefs":
      return {
        ...store,
        chefs: action.payload,
      };
    case "set_single_chef":
      return {
        ...store,
        singleChef: action.payload,
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
    case "update_logged_chef":
      return {
        ...store,
        loggedChef: {
          ...store.loggedChef,
          chef: {
            ...store.loggedChef.chef,
            ...action.payload,
          },
        },
      };
    case "set_recipe_ingredients":
      return {
        ...store,
        recipeIngredients: action.payload
      }
    case "set_single_recipe_ingredient":
      return {
        ...store,
        singleRecipeIngredient: action.payload
      }
    case "cook_login":
      return {
        ...store,
        loggedCook: {
          cookAuth: true,
          cook: action.payload.cook,
          restaurant: action.payload.restaurant,
        },
      };
    case "cook_logout":
      return {
        ...store,
        loggedCook: {
          cookAuth: false,
          cook: {},
          restaurant: "",
        },
      };
    case "chef_logout":
      return {
        ...store,
        loggedChef: {
          chefAuth: false,
          chef: {},
          restaurant: "",
        },
      };
      case "waiter_login":
        return {
          ...store,
          loggedWaiter: {
            waiterAuth: true,
            waiter: action.payload.waiter,
            restaurant: action.payload.waiter_restaurant,
          },
        };
      case "waiter_logout":
        return {
          ...store,
          loggedWaiter: {
            waiterAuth: false,
            waiter: {},
            restaurant: "",
          },
        };
    case "set_hosts":
      return {
        ...store,
        hosts: action.payload,
      };
    case "set_single_host":
      return {
        ...store,
        singleHost: action.payload,
      };
    case "set_restaurant_host":
      return {
        ...store,
        restaurantHost: action.payload,
      };
    case "host_login":
      return {
        ...store,
        loggedHost: {
          hostAuth: true,
          host: action.payload.host,
          restaurant: action.payload.host_restaurant,
        },
      };
    case "host_logout":
      return {
        ...store,
        loggedHost: {
          hostAuth: false,
          host: {},
          restaurant: "",
        },
      };
    default:
      return store;
  }
}