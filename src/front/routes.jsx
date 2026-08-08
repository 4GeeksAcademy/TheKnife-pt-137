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
import WaiterRecipes from "./pages/recipe/actions/WaiterRecipes";

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


// Orders
import Orders from "./pages/order/Orders";
import CreateOrderForm from "./pages/order/CreateOrderForm";
import SingleOrder from "./pages/order/SingleOrder";
import EditOrderForm from "./pages/order/EditOrderForm";
import Tables from "./pages/table/Tables";
import CreateTableForm from "./pages/table/CreateTableForm";
import SingleTable from "./pages/table/SingleTable";
import EditTableForm from "./pages/table/EditTableForm";
import RestaurantOrders from "./pages/order/actions/RestaurantOrders";
import CookOrders from "./pages/order/actions/CookOrders";
import RestaurantSingleOrder from "./pages/order/actions/RestaurantSingleOrder";


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

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

      {/* Products */}
      <Route path="/products" element={<Products />} />
      <Route path="/create_product" element={<CreateProductForm />} />
      <Route path="/edit_product/:product_id" element={<EditProductForm />} />
      <Route path="/single_product/:product_id" element={<SingleProduct />} />
      <Route path="/restaurants/:restaurant_id/create_product" element={<ChefProductCreate />} />
      <Route path="/restaurants/:restaurant_id/products" element={<ChefRestaurantProducts />} />
      <Route path="/restaurants/:restaurant_id/edit_product/:product_id" element={<ChefEditProduct />} />
      <Route path="/restaurants/:restaurant_id/single_product/:product_id" element={<ChefSingleProduct />} />

      {/* Recipes */}
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/create_recipe" element={<CreateRecipeForm />} />
      <Route path="/recipe/:recipe_id" element={<SingleRecipe />} />
      <Route path="/edit_recipe/:recipe_id" element={<EditRecipeForm />} />
      <Route path="/restaurants/:restaurant_id/recipes" element={<RestaurantRecipes />} />
      <Route path="/restaurants/:restaurant_id/cook_recipes" element={<CookRecipes />} />
      <Route path="/restaurants/:restaurant_id/create_recipe" element={<ChefCreateRecipe />} />
      <Route path="/restaurants/:restaurant_id/edit_recipe/:recipe_id" element={<ChefEditRecipe />} />
      <Route path="/restaurants/:restaurant_id/recipe/:recipe_id" element={<RestaurantSingleRecipe />} />
      <Route path="/restaurants/:restaurant_id/recipes" element={<RestaurantRecipes />} />
      <Route path="/restaurants/:restaurant_id/cook_recipes" element={<CookRecipes />} />
      <Route path="/restaurants/:restaurant_id/waiter_recipes" element={<WaiterRecipes />} />
      <Route path="/restaurants/:restaurant_id/create_recipe" element={<ChefCreateRecipe />} />

      {/* Restaurants */}
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/create_restaurant" element={<CreateRestaurantForm />} />
      <Route path="/single_restaurant/:restaurant_id" element={<SingleRestaurant />} />
      <Route path="/edit_restaurant/:restaurant_id" element={<EditRestaurantForm />} />
      <Route path="/register_restaurant" element={<ChefCreateRestaurant />} />
      <Route path="/restaurants/:restaurant_id/edit_restaurant" element={<ChefEditRestaurant />} />
      <Route path="/restaurants/:restaurant_id" element={<ChefGetRestaurant />} />
      
      {/* Managers */}
      <Route path="/managers" element={<Managers />} />
      <Route path="/create_manager" element={<CreateManagerForm />} />
      <Route path="/edit_manager/:manager_id" element={<EditManagerForm />} />
      <Route path="/manager_login" element={<ManagerLogin />} />
      <Route path="/manager_dashboard" element={<ManagerDashboard />} />

      {/* Ingredients */}
      <Route path="/ingredients" element={<Ingredients />} />
      <Route path="/ingredients/create" element={<CreateIngredientForm />} />
      <Route path="/ingredients/:ingredient_id" element={<SingleIngredient />} />
      <Route path="/ingredients/edit/:ingredient_id" element={<EditIngredientForm />} />
      <Route path="/chef_ingredients" element={<ChefIngredients />} />
      <Route path="/chef_ingredients/inactive" element={<ChefInactiveIngredients />} />
      <Route path="/chef_ingredients/create" element={<ChefCreateIngredient />} />
      <Route path="/chef_ingredients/edit/:ingredient_id" element={<ChefEditIngredient />} />

      {/* Waiters */}
      <Route path="/waiters" element={<Waiters />} />
      <Route path="/create_waiter" element={<CreateWaiterForm />} />
      <Route path="/single_waiter/:waiter_id" element={<SingleWaiter />} />
      <Route path="/edit_waiter/:waiter_id" element={<EditWaiterForm />} />
      <Route path="/waiter_login" element={<WaiterLogin />} />
      <Route path="/waiter_dashboard" element={<WaiterDashboard />} />
      <Route path="/restaurants/:restaurant_id/register_waiter" element={<RegisterWaiter />} />
      <Route path="/restaurants/:restaurant_id/waiters" element={<RestaurantWaiters />} />

      {/* Orders */}
      <Route path="/orders" element={<Orders />} />
      <Route path="/create_order" element={<CreateOrderForm />} />
      <Route path="/single_order/:order_id" element={<SingleOrder />} />
      <Route path="/edit_order/:order_id" element={<EditOrderForm />} />
      <Route path="/restaurants/:restaurant_id/orders" element={<RestaurantOrders />} />
      <Route path="/restaurants/:restaurant_id/cook_orders" element={<CookOrders />} />
      <Route path="/restaurants/:restaurant_id/orders/:order_id" element={<RestaurantSingleOrder />} />


      {/* Tables */}
      <Route path="/tables" element={<Tables />} />
      <Route path="/create_table" element={<CreateTableForm />} />
      <Route path="/single_table/:table_id" element={<SingleTable />} />
      <Route path="/edit_table/:table_id" element={<EditTableForm />} />

      {/* Chefs */}
      <Route path="/chefs" element={<Chefs />} />
      <Route path="/create_chef" element={<CreateChefForm />} />
      <Route path="/chef_register" element={<RegisterChef />} />
      <Route path="/single_chef/:chef_id" element={<SingleChef />} />
      <Route path="/edit_chef/:chef_id" element={<EditChefForm />} />
      <Route path="/chef_login" element={<ChefLogin />} />
      <Route path="/chef_dashboard" element={<ChefDashboard />} />

      {/* Cooks */}
      <Route path="/cooks" element={<Cooks />} />
      <Route path="/create_cook" element={<CreateCookForm />} />
      <Route path="/single_cook/:cook_id" element={<SingleCook />} />
      <Route path="/edit_cook/:cook_id" element={<EditCookForm />} />
      <Route path="/cook_login" element={<CookLogin />} />
      <Route path="/cook_dashboard" element={<CookDashboard />} />
      <Route path="/restaurants/:restaurant_id/register_cook" element={<RegisterCook />} />
      <Route path="/restaurants/:restaurant_id/cooks" element={<RestaurantCooks />} />

      {/* OrderProducts */}
      <Route path="/orders/:order_id/products" element={<ProductsListForOrder />} />

    </Route>
  )
);