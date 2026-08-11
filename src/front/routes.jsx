// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
// 4Geeks imports
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// CocinApp imports
import { ManagerRoute } from "./components/ManagerRoute";
import Maps from "./pages/Maps";
import { APIProvider } from "@vis.gl/react-google-maps";
import ClientSearchNearbyRestaurants from "./pages/restaurant/actions/ClientSearchNearbyRestaurants";

// Products
import Products from "./pages/product/Products";
import CreateProductForm from "./pages/product/CreateProductForm";
import EditProductForm from "./pages/product/EditProductForm";
import SingleProduct from "./pages/product/SingleProduct";
import ChefProductCreate from "./pages/product/actions/ChefProductCreate";
import ChefRestaurantProducts from "./pages/product/actions/ChefRestaurantProducts";
import ChefEditProduct from "./pages/product/actions/ChefEditProduct";
import ChefSingleProduct from "./pages/product/actions/ChefSingleProduct";

// Recipes
import Recipes from "./pages/recipe/Recipes";
import CreateRecipeForm from "./pages/recipe/CreateRecipeForm";
import SingleRecipe from "./pages/recipe/SingleRecipe";
import EditRecipeForm from "./pages/recipe/EditRecipeForm";
import RestaurantRecipes from "./pages/recipe/actions/RestaurantRecipes";
import CookRecipes from "./pages/recipe/actions/CookRecipes";
import ChefCreateRecipe from "./pages/recipe/actions/ChefCreateRecipe";
import ChefEditRecipe from "./pages/recipe/actions/ChefEditRecipe";
import RestaurantSingleRecipe from "./pages/recipe/actions/RestaurantSingleRecipe";
import RecipeIngredientsGallery from "./pages/recipe/actions/RecipeIngredientsGallery";

// Restaurants
import Restaurants from "./pages/restaurant/Restaurants";
import CreateRestaurantForm from "./pages/restaurant/CreateRestaurantForm";
import SingleRestaurant from "./pages/restaurant/SingleRestaurant";
import EditRestaurantForm from "./pages/restaurant/EditRestaurantForm";
import ChefCreateRestaurant from "./pages/restaurant/actions/ChefCreateRestaurant";
import ChefEditRestaurant from "./pages/restaurant/actions/ChefEditRestaurant";
import ChefGetRestaurant from "./pages/restaurant/actions/ChefGetRestaurant";


// Managers
import Managers from "./pages/manager/Managers";
import CreateManagerForm from "./pages/manager/CreateManagerForm";
import EditManagerForm from "./pages/manager/EditManagerForm";
import ManagerLogin from "./pages/manager/ManagerLogin";
import ManagerDashboard from "./pages/manager/ManagerDashboard";


// Waiters
import Waiters from "./pages/waiter/Waiters";
import CreateWaiterForm from "./pages/waiter/CreateWaiterForm";
import SingleWaiter from "./pages/waiter/SingleWaiter";
import EditWaiterForm from "./pages/waiter/EditWaiterForm";
import WaiterLogin from "./pages/waiter/WaiterLogin";
import WaiterDashboard from "./pages/waiter/WaiterDashboard";
import RegisterWaiter from "./pages/waiter/actions/RegisterWaiter";
import RestaurantWaiters from "./pages/waiter/actions/RestaurantWaiters";
import WaiterTables from "./pages/table/actions/WaiterTables";
import WaiterCreateTable from "./pages/table/actions/WaiterCreateTable";

// Orders
import Orders from "./pages/order/Orders";
import CreateOrderForm from "./pages/order/CreateOrderForm";
import SingleOrder from "./pages/order/SingleOrder";
import EditOrderForm from "./pages/order/EditOrderForm";
import Tables from "./pages/table/Tables";
import CreateTableForm from "./pages/table/CreateTableForm";
import SingleTable from "./pages/table/SingleTable";
import EditTableForm from "./pages/table/EditTableForm";

// Reservations
import Reservations from "./pages/reservation/Reservations";
import CreateReservationForm from "./pages/reservation/CreateReservationForm";
import SingleReservation from "./pages/reservation/SingleReservation";
import EditReservationForm from "./pages/reservation/EditReservationForm";

import RestaurantOrders from "./pages/order/actions/RestaurantOrders";
import CookOrders from "./pages/order/actions/CookOrders";
import RestaurantSingleOrder from "./pages/order/actions/RestaurantSingleOrder";
import WaiterAddProducts from "./pages/order/actions/WaiterAddProducts";

// Chefs
import Chefs from "./pages/chef/Chefs";
import CreateChefForm from "./pages/chef/CreateChefForm";
import EditChefForm from "./pages/chef/EditChefForm";
import SingleChef from "./pages/chef/SingleChef";
import ChefLogin from "./pages/chef/ChefLogin";
import ChefDashboard from "./pages/chef/ChefDashboard";
import RegisterChef from "./pages/chef/RegisterChef";

// INGREDIENTS imports
import Ingredients from "./pages/ingredient/Ingredients";
import CreateIngredientForm from "./pages/ingredient/CreateIngredientForm";
import SingleIngredient from "./pages/ingredient/SingleIngredient";
import EditIngredientForm from "./pages/ingredient/EditIngredientForm";
import ChefIngredients from "./pages/ingredient/actions/ChefIngredients";
import ChefInactiveIngredients from "./pages/ingredient/actions/ChefInactiveIngredients";
import ChefCreateIngredient from "./pages/ingredient/actions/ChefCreateIngredient";
import ChefEditIngredient from "./pages/ingredient/actions/ChefEditIngredient";
import CookIngredients from "./pages/ingredient/actions/CookIngredients";
import CookSingleIngredient from "./pages/ingredient/actions/CookSingleIngredient";

// Cooks
import Cooks from "./pages/cook/Cooks";
import CreateCookForm from "./pages/cook/CreateCookForm";
import SingleCook from "./pages/cook/SingleCook";
import EditCookForm from "./pages/cook/EditCookForm";
import CookLogin from "./pages/cook/CookLogin";
import CookDashboard from "./pages/cook/CookDashboard";
import RegisterCook from "./pages/cook/actions/RegisterCook";
import RestaurantCooks from "./pages/cook/actions/RestaurantCooks";

// OrderProducts
import ProductsListForOrder from "./pages/order/ProductsListForOrder";

// Hosts
import Hosts from "./pages/host/Hosts";
import EditHostForm from "./pages/host/EditHostForm";
import SingleHost from "./pages/host/SingleHost";
import HostLogin from "./pages/host/HostLogin";
import HostDashboard from "./pages/host/HostDashboard";
import RegisterHost from "./pages/host/actions/RegisterHost";

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

      {/* Google Maps */}
        
      <Route path="/maps/:restaurant_id" element={<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}><Maps /></APIProvider>} />
      <Route path="/restaurants/nearby_search" element={<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}><ClientSearchNearbyRestaurants /></APIProvider>} />

      {/* Products (CRUD genérico -> solo manager) */}
      <Route path="/products" element={<ManagerRoute><Products /></ManagerRoute>} />
      <Route path="/create_product" element={<ManagerRoute><CreateProductForm /></ManagerRoute>} />
      <Route path="/edit_product/:product_id" element={<ManagerRoute><EditProductForm /></ManagerRoute>} />
      <Route path="/single_product/:product_id" element={<ManagerRoute><SingleProduct /></ManagerRoute>} />
      <Route path="/restaurants/:restaurant_id/create_product" element={<ChefProductCreate />} />
      <Route path="/restaurants/:restaurant_id/products" element={<ChefRestaurantProducts />} />
      <Route path="/restaurants/:restaurant_id/edit_product/:product_id" element={<ChefEditProduct />} />
      <Route path="/restaurants/:restaurant_id/single_product/:product_id" element={<ChefSingleProduct />} />

      {/* Recipes (CRUD genérico -> solo manager) */}
      <Route path="/recipes" element={<ManagerRoute><Recipes /></ManagerRoute>} />
      <Route path="/create_recipe" element={<ManagerRoute><CreateRecipeForm /></ManagerRoute>} />
      <Route path="/recipe/:recipe_id" element={<ManagerRoute><SingleRecipe /></ManagerRoute>} />
      <Route path="/edit_recipe/:recipe_id" element={<ManagerRoute><EditRecipeForm /></ManagerRoute>} />
      <Route path="/restaurants/:restaurant_id/recipes" element={<RestaurantRecipes />} />
      <Route path="/restaurants/:restaurant_id/cook_recipes" element={<CookRecipes />} />
      <Route path="/restaurants/:restaurant_id/create_recipe" element={<ChefCreateRecipe />} />
      <Route path="/restaurants/:restaurant_id/edit_recipe/:recipe_id" element={<ChefEditRecipe />} />
      <Route path="/restaurants/:restaurant_id/recipe/:recipe_id" element={<RestaurantSingleRecipe />} />
      <Route path="/restaurants/:restaurant_id/recipe/:recipe_id/ingredients" element={<RecipeIngredientsGallery />} />
      <Route path="/restaurants/:restaurant_id/recipes" element={<RestaurantRecipes />} />
      <Route path="/restaurants/:restaurant_id/cook_recipes" element={<CookRecipes />} />
      <Route path="/restaurants/:restaurant_id/create_recipe" element={<ChefCreateRecipe />} />

      {/* Restaurants (CRUD genérico -> solo manager) */}
      <Route path="/restaurants" element={<ManagerRoute><Restaurants /></ManagerRoute>} />
      <Route path="/create_restaurant" element={<ManagerRoute><CreateRestaurantForm /></ManagerRoute>} />
      <Route path="/single_restaurant/:restaurant_id" element={<ManagerRoute><SingleRestaurant /></ManagerRoute>} />
      <Route path="/edit_restaurant/:restaurant_id" element={<ManagerRoute><EditRestaurantForm /></ManagerRoute>} />
      <Route path="/register_restaurant" element={<ChefCreateRestaurant />} />
      <Route path="/restaurants/:restaurant_id/edit_restaurant" element={<ChefEditRestaurant />} />
      <Route path="/restaurants/:restaurant_id" element={<ChefGetRestaurant />} />
      
      {/* Managers (CRUD genérico -> solo manager; registro/login/dashboard públicos) */}
      <Route path="/managers" element={<ManagerRoute><Managers /></ManagerRoute>} />
      <Route path="/create_manager" element={<CreateManagerForm />} />
      <Route path="/edit_manager/:manager_id" element={<ManagerRoute><EditManagerForm /></ManagerRoute>} />
      <Route path="/manager_login" element={<ManagerLogin />} />
      <Route path="/manager_dashboard" element={<ManagerDashboard />} />

      {/* Ingredients (CRUD genérico -> solo manager) */}
      <Route path="/ingredients" element={<ManagerRoute><Ingredients /></ManagerRoute>} />
      <Route path="/ingredients/create" element={<ManagerRoute><CreateIngredientForm /></ManagerRoute>} />
      <Route path="/ingredients/:ingredient_id" element={<ManagerRoute><SingleIngredient /></ManagerRoute>} />
      <Route path="/ingredients/edit/:ingredient_id" element={<ManagerRoute><EditIngredientForm /></ManagerRoute>} />
      <Route path="/chef_ingredients" element={<ChefIngredients />} />
      <Route path="/chef_ingredients/inactive" element={<ChefInactiveIngredients />} />
      <Route path="/chef_ingredients/create" element={<ChefCreateIngredient />} />
      <Route path="/chef_ingredients/edit/:ingredient_id" element={<ChefEditIngredient />} />
      <Route path="/cook_ingredients" element={<CookIngredients />} />
      <Route path="/cook_ingredients/:ingredient_id" element={<CookSingleIngredient />} />

      {/* Waiters (CRUD genérico -> solo manager) */}
      <Route path="/waiters" element={<ManagerRoute><Waiters /></ManagerRoute>} />
      <Route path="/create_waiter" element={<ManagerRoute><CreateWaiterForm /></ManagerRoute>} />
      <Route path="/single_waiter/:waiter_id" element={<ManagerRoute><SingleWaiter /></ManagerRoute>} />
      <Route path="/edit_waiter/:waiter_id" element={<ManagerRoute><EditWaiterForm /></ManagerRoute>} />
      <Route path="/waiter_login" element={<WaiterLogin />} />
      <Route path="/waiter_dashboard" element={<WaiterDashboard />} />
      <Route path="/restaurants/:restaurant_id/register_waiter" element={<RegisterWaiter />} />
      <Route path="/restaurants/:restaurant_id/waiters" element={<RestaurantWaiters />} />

      {/* Orders (CRUD genérico -> solo manager) */}
      <Route path="/orders" element={<ManagerRoute><Orders /></ManagerRoute>} />
      <Route path="/create_order" element={<ManagerRoute><CreateOrderForm /></ManagerRoute>} />
      <Route path="/single_order/:order_id" element={<ManagerRoute><SingleOrder /></ManagerRoute>} />
      <Route path="/edit_order/:order_id" element={<ManagerRoute><EditOrderForm /></ManagerRoute>} />
      <Route path="/restaurants/:restaurant_id/orders" element={<RestaurantOrders />} />
      <Route path="/restaurants/:restaurant_id/cook_orders" element={<CookOrders />} />
      <Route path="/restaurants/:restaurant_id/orders/:order_id" element={<RestaurantSingleOrder />} />
      <Route path="/restaurants/:restaurant_id/orders" element={<RestaurantOrders />} />
      <Route path="/restaurants/:restaurant_id/cook_orders" element={<CookOrders />} />
      <Route path="/restaurants/:restaurant_id/orders/:order_id" element={<RestaurantSingleOrder />} />
      <Route path="/restaurants/:restaurant_id/orders/:order_id/products" element={<WaiterAddProducts />} />

      {/* Tables (CRUD genérico -> solo manager) */}
      <Route path="/restaurants/:restaurant_id/waiter_tables" element={<WaiterTables />} />
      <Route path="/restaurants/:restaurant_id/waiter_tables/create" element={<WaiterCreateTable />} />
      <Route path="/tables" element={<ManagerRoute><Tables /></ManagerRoute>} />
      <Route path="/create_table" element={<ManagerRoute><CreateTableForm /></ManagerRoute>} />
      <Route path="/single_table/:table_id" element={<ManagerRoute><SingleTable /></ManagerRoute>} />
      <Route path="/edit_table/:table_id" element={<ManagerRoute><EditTableForm /></ManagerRoute>} />

      {/* Reservations (CRUD genérico -> solo manager) */}
      <Route path="/reservations" element={<ManagerRoute><Reservations /></ManagerRoute>} />
      <Route path="/create_reservation" element={<ManagerRoute><CreateReservationForm /></ManagerRoute>} />
      <Route path="/single_reservation/:reservation_id" element={<ManagerRoute><SingleReservation /></ManagerRoute>} />
      <Route path="/edit_reservation/:reservation_id" element={<ManagerRoute><EditReservationForm /></ManagerRoute>} />

      {/* Chefs (CRUD genérico -> solo manager; register/login/dashboard aparte) */}
      <Route path="/chefs" element={<ManagerRoute><Chefs /></ManagerRoute>} />
      <Route path="/create_chef" element={<ManagerRoute><CreateChefForm /></ManagerRoute>} />
      <Route path="/chef_register" element={<RegisterChef />} />
      <Route path="/single_chef/:chef_id" element={<ManagerRoute><SingleChef /></ManagerRoute>} />
      <Route path="/edit_chef/:chef_id" element={<ManagerRoute><EditChefForm /></ManagerRoute>} />
      <Route path="/chef_login" element={<ChefLogin />} />
      <Route path="/chef_dashboard" element={<ChefDashboard />} />

      {/* Cooks (CRUD genérico -> solo manager) */}
      <Route path="/cooks" element={<ManagerRoute><Cooks /></ManagerRoute>} />
      <Route path="/create_cook" element={<ManagerRoute><CreateCookForm /></ManagerRoute>} />
      <Route path="/single_cook/:cook_id" element={<ManagerRoute><SingleCook /></ManagerRoute>} />
      <Route path="/edit_cook/:cook_id" element={<ManagerRoute><EditCookForm /></ManagerRoute>} />
      <Route path="/cook_login" element={<CookLogin />} />
      <Route path="/cook_dashboard" element={<CookDashboard />} />
      <Route path="/restaurants/:restaurant_id/register_cook" element={<RegisterCook />} />
      <Route path="/restaurants/:restaurant_id/cooks" element={<RestaurantCooks />} />

      {/* OrderProducts */}
      <Route path="/orders/:order_id/products" element={<ProductsListForOrder />} />

      {/* Hosts (CRUD genérico -> solo manager; login/dashboard aparte; registro por chef) */}
      <Route path="/hosts" element={<ManagerRoute><Hosts /></ManagerRoute>} />
      <Route path="/edit_host/:host_id" element={<ManagerRoute><EditHostForm /></ManagerRoute>} />
      <Route path="/single_host/:host_id" element={<ManagerRoute><SingleHost /></ManagerRoute>} />
      <Route path="/host_login" element={<HostLogin />} />
      <Route path="/host_dashboard" element={<HostDashboard />} />
      <Route path="/restaurants/:restaurant_id/register_host" element={<RegisterHost />} />

    </Route>
  )
);