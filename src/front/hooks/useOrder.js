// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import {
  getOrdersService,
  getSingleOrderService,
  createOrderService,
  deleteOrderService,
  editOrderService,
  getAllRestaurantOrdersService,
  getSingleRestaurantOrderService,
  updateOrderStatusService,
  closeOrderService,
  waiterCreateOrderService,
} from "../services/orderService";

export function useOrder() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // GET orders
  async function getOrders() {
    try {
      const data = await getOrdersService();
      dispatch({ type: "set_orders", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  // GET single order
  async function getSingleOrder(orderId) {
    try {
      const order = await getSingleOrderService(orderId);
      dispatch({ type: "set_single_order", payload: order });
    } catch (error) {
      console.log(error);
    }
  }

  // Create order
  async function createOrder(orderData, redirectTo) {
    try {
      const response = await createOrderService(orderData);
      const data = await response.json();
      console.log(data);
      navigate(redirectTo || "/orders");
    } catch (error) {
      console.log(error);
    }
  }

  // Delete order
  async function deleteOrder(orderId) {
    try {
      const message = await deleteOrderService(orderId);
      console.log(message);
      getOrders();
    } catch (error) {
      console.log(error);
    }
  }

  // Edit order
  async function editOrder(orderId, orderData) {
    try {
      const response = await editOrderService(orderId, orderData);
      const data = await response.json();
      console.log(data);
      navigate("/orders");
    } catch (error) {
      console.log(error);
    }
  }

  // Waiter creates a new order on a free table of his restaurant
  async function waiterCreateOrder(restaurant_id, orderData) {
    try {
      const order = await waiterCreateOrderService(restaurant_id, orderData);
      navigate(`/restaurants/${restaurant_id}/orders/${order.id}`);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  /////////////////////////////////////////////////
  // Get all restaurant orders
  async function getAllRestaurantOrders(restaurant_id) {
    try {
      const data = await getAllRestaurantOrdersService(restaurant_id);
      console.log(data);
      dispatch({ type: "set_orders", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  // Chef, waiter or cook gets one order of their restaurant
  async function getSingleRestaurantOrder(restaurant_id, order_id) {
    try {
      const order = await getSingleRestaurantOrderService(
        restaurant_id,
        order_id,
      );
      dispatch({ type: "set_single_order", payload: order });
    } catch (error) {
      console.log(error);
    }
  }

  // Cook updates the state of an order (doing/done)
  async function updateOrderStatus(restaurant_id, order_id, state) {
    try {
      const order = await updateOrderStatusService(
        restaurant_id,
        order_id,
        state,
      );
      console.log(order);
      getAllRestaurantOrders(restaurant_id);
    } catch (error) {
      console.log(error);
    }
  }

  // Waiter closes an order (done -> closed)
  async function closeOrder(restaurant_id, order_id) {
    try {
      const order = await closeOrderService(restaurant_id, order_id);
      console.log(order);
      getSingleRestaurantOrder(restaurant_id, order_id);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getOrders,
    deleteOrder,
    getSingleOrder,
    createOrder,
    editOrder,
    getAllRestaurantOrders,
    getSingleRestaurantOrder,
    updateOrderStatus,
    closeOrder,
    waiterCreateOrder,
  };
}