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

import Recipes from "./pages/recipe/Recipes";
import CreateRecipeForm from "./pages/recipe/CreateRecipeForm";
import SingleRecipe from "./pages/recipe/SingleRecipe";
import EditRecipeForm from "./pages/recipe/EditRecipeForm";

import Restaurants from "./pages/restaurant/Restaurants";
import CreateRestaurantForm from "./pages/restaurant/CreateRestaurantForm";
import SingleRestaurant from "./pages/restaurant/SingleRestaurant";
import EditRestaurantForm from "./pages/restaurant/EditRestaurantForm";
import Waiters from "./pages/waiter/Waiters";
import CreateWaiterForm from "./pages/waiter/CreateWaiterForm";
import SingleWaiter from "./pages/waiter/SingleWaiter";
import EditWaiterForm from "./pages/waiter/EditWaiterForm";
import Orders from "./pages/order/Orders";
import CreateOrderForm from "./pages/order/CreateOrderForm";
import SingleOrder from "./pages/order/SingleOrder";
import EditOrderForm from "./pages/order/EditOrderForm";

// INGREDIENTS imports
import Ingredients from "./pages/ingredient/Ingredients";
import CreateIngredientForm from "./pages/ingredient/CreateIngredientForm";
import SingleIngredient from "./pages/ingredient/SingleIngredient";
import EditIngredientForm from "./pages/ingredient/EditIngredientForm";

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
      <Route path="/waiters" element={<Waiters />} />
      <Route path="/create_waiter" element={<CreateWaiterForm />} />
      <Route path="/single_waiter/:waiter_id" element={<SingleWaiter />} />
      <Route path="/edit_waiter/:waiter_id" element={<EditWaiterForm />} />

      <Route path="/orders" element={<Orders />} />
      <Route path="/create_order" element={<CreateOrderForm />} />
      <Route path="/single_order/:order_id" element={<SingleOrder />} />
      <Route path="/edit_order/:order_id" element={<EditOrderForm />} />

    </Route>
  )
);
