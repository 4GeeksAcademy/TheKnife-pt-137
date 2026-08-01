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
import Products from "./pages/product/Products";
import CreateProductForm from "./pages/product/CreateProductForm";
import EditProductForm from "./pages/product/EditProductForm";
import SingleProduct from "./pages/product/SingleProduct";

// Recipes
import Recipes from "./pages/recipe/Recipes";
import CreateRecipeForm from "./pages/recipe/CreateRecipeForm";
import SingleRecipe from "./pages/recipe/SingleRecipe";
import EditRecipeForm from "./pages/recipe/EditRecipeForm";

// Restaurants
import Restaurants from "./pages/restaurant/Restaurants";
import CreateRestaurantForm from "./pages/restaurant/CreateRestaurantForm";
import SingleRestaurant from "./pages/restaurant/SingleRestaurant";
import EditRestaurantForm from "./pages/restaurant/EditRestaurantForm";

// Waiters
import Waiters from "./pages/waiter/Waiters";
import CreateWaiterForm from "./pages/waiter/CreateWaiterForm";
import SingleWaiter from "./pages/waiter/SingleWaiter";
import EditWaiterForm from "./pages/waiter/EditWaiterForm";

// Orders
import Orders from "./pages/order/Orders";
import CreateOrderForm from "./pages/order/CreateOrderForm";
import SingleOrder from "./pages/order/SingleOrder";
import EditOrderForm from "./pages/order/EditOrderForm";
import Tables from "./pages/table/Tables";
import CreateTableForm from "./pages/table/CreateTableForm";
import SingleTable from "./pages/table/SingleTable";
import EditTableForm from "./pages/table/EditTableForm";

// Chefs
import Chefs from "./pages/chef/Chefs";
import CreateChefForm from "./pages/chef/CreateChefForm";
import EditChefForm from "./pages/chef/EditChefForm";
import SingleChef from "./pages/chef/SingleChef";
import ChefLogin from "./pages/chef/ChefLogin";
import ChefDashboard from "./pages/chef/ChefDashboard";

// INGREDIENTS imports
import Ingredients from "./pages/ingredient/Ingredients";
import CreateIngredientForm from "./pages/ingredient/CreateIngredientForm";
import SingleIngredient from "./pages/ingredient/SingleIngredient";
import EditIngredientForm from "./pages/ingredient/EditIngredientForm";

// Cooks
import Cooks from "./pages/cook/Cooks";
import CreateCookForm from "./pages/cook/CreateCookForm";
import SingleCook from "./pages/cook/SingleCook";
import EditCookForm from "./pages/cook/EditCookForm";
import CookLogin from "./pages/cook/CookLogin";
import CookDashboard from "./pages/cook/CookDashboard";

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

      {/* Recipes */}
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/create_recipe" element={<CreateRecipeForm />} />
      <Route path="/recipe/:recipe_id" element={<SingleRecipe />} />
      <Route path="/edit_recipe/:recipe_id" element={<EditRecipeForm />} />

      {/* Restaurants */}
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/create_restaurant" element={<CreateRestaurantForm />} />
      <Route path="/single_restaurant/:restaurant_id" element={<SingleRestaurant />} />
      <Route path="/edit_restaurant/:restaurant_id" element={<EditRestaurantForm />} />

      {/* Ingredients */}
      <Route path="/ingredients" element={<Ingredients />} />
      <Route path="/ingredients/create" element={<CreateIngredientForm />} />
      <Route path="/ingredients/:ingredient_id" element={<SingleIngredient />} />
      <Route path="/ingredients/edit/:ingredient_id" element={<EditIngredientForm />} />

      {/* Waiters */}
      <Route path="/waiters" element={<Waiters />} />
      <Route path="/create_waiter" element={<CreateWaiterForm />} />
      <Route path="/single_waiter/:waiter_id" element={<SingleWaiter />} />
      <Route path="/edit_waiter/:waiter_id" element={<EditWaiterForm />} />

      {/* Orders */}
      <Route path="/orders" element={<Orders />} />
      <Route path="/create_order" element={<CreateOrderForm />} />
      <Route path="/single_order/:order_id" element={<SingleOrder />} />
      <Route path="/edit_order/:order_id" element={<EditOrderForm />} />

      <Route path="/tables" element={<Tables />} />
      <Route path="/create_table" element={<CreateTableForm />} />
      <Route path="/single_table/:table_id" element={<SingleTable />} />
      <Route path="/edit_table/:table_id" element={<EditTableForm />} />
      {/* Chefs */}
      <Route path="/chefs" element={<Chefs />} />
      <Route path="/create_chef" element={<CreateChefForm />} />
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

    </Route>
  )
);
