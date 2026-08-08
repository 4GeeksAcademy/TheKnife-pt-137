// Services imports
import { useNavigate } from "react-router-dom";
import {
  getProductsService,
  deleteProductService,
  getSingleProductService,
  createProductService,
  editProductService,
  deleteRestaurantProductService,
  getAllRestaurantProductsService,
  chefCreateProductService,
  chefEditProductService,
  getOneRestaurantProductService
} from "../services/productService";
import useGlobalReducer from "./useGlobalReducer";


export function useProduct() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // GET products
  async function getProducts() {
    try {
      const data = await getProductsService();
      dispatch({ type: "set_products", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  // GET single product
  async function getSingleProduct(productId) {
    try {
      const product = await getSingleProductService(productId);
      dispatch({ type: "set_single_product", payload: product });
    } catch (error) {
      console.log(error);
    }
  }

  // Create product
  async function createProduct(productData) {
    try {
      const response = await createProductService(productData);
      const data = await response.json();
      console.log(data);
      navigate("/products");
    } catch (error) {
      console.log(error);
    }
  }

  // Delete product
  async function deleteProduct(productId) {
    try {
      const message = await deleteProductService(productId);
      console.log(message);
      getProducts();
    } catch (error) {
      console.log(error);
    }
  }

  // Edit product
  async function editProduct(productId, productData) {
    try {
      const response = await editProductService(productId, productData);
      const data = await response.json();
      console.log(data);
      navigate("/products");
    } catch (error) {
      console.log(error);
    }
  }

  /////////////////////////////////////////////////
  // Get all restaurant products
  async function getAllRestaurantProducts(restaurant_id) {
    try {
      const data = await getAllRestaurantProductsService(restaurant_id);
      dispatch({
        type: "set_products",
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Chef or waiter gets one product
  async function getOneRestaurantProduct(restaurant_id, product_id) {
    try {
      const product = await getOneRestaurantProductService(restaurant_id, product_id)
      console.log(product)
      dispatch({type: "set_single_product", payload: product})
    } catch (error) {console.log(error)}
  }

  // Chef deletes a product of his restaurant
  async function deleteRestaurantProduct(restaurant_id, product_id) {
    try {
      const data = await deleteRestaurantProductService(
        restaurant_id,
        product_id,
      );
      console.log(data);
      getAllRestaurantProducts(restaurant_id);
    } catch (error) {
      console.log(error);
    }
  }

  // Chef creates a product
  async function chefCreateProduct(restaurant_id, productData) {
    try {
      const data = await chefCreateProductService(restaurant_id, productData);
      console.log(data);
      navigate("/chef_dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  // Chef edits product of his restaurant
  async function chefEditProduct(restaurant_id, product_id, productData) {
    try {
      const response = await chefEditProductService(
        restaurant_id,
        product_id,
        productData,
      );
      const data = await response.json();
      console.log(data);
      navigate("/chef_dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getProducts,
    deleteProduct,
    getSingleProduct,
    createProduct,
    editProduct,
    getAllRestaurantProducts,
    deleteRestaurantProduct,
    chefCreateProduct,
    chefEditProduct,
    getOneRestaurantProduct
  };
}
