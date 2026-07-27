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

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />

      {/* CocinApp routes */}
      <Route path="/products" element={<Products />} />
      <Route path="/create_product" element={<CreateProductForm />} />
      <Route path="/edit_product/:product_id" element={<EditProductForm />} />
      <Route path="/single_product/:product_id" element={<SingleProduct />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/create_recipe" element={<CreateRecipeForm />} />
      <Route path="/recipe/:recipe_id" element={<SingleRecipe />} />
      <Route path="/edit_recipe/:recipe_id" element={<EditRecipeForm />} />


    </Route>
  )
);