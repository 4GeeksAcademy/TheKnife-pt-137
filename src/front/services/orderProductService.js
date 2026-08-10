const backendURL = import.meta.env.VITE_BACKEND_URL;

// GET all order-products (manager)
export async function getOrderProductsService() {
  const managerToken = localStorage.getItem("managertoken");
  const response = await fetch(`${backendURL}/order_products`, {
    headers: {
      "Authorization": `Bearer ${managerToken}`,
    },
  });
  const data = response.json();
  return data;
}

// GET single order-product (manager)
export async function getSingleOrderProductService(orderProductId) {
  const managerToken = localStorage.getItem("managertoken");
  const response = await fetch(
    `${backendURL}/order_products/${orderProductId}`,
    {
      headers: {
        "Authorization": `Bearer ${managerToken}`,
      },
    },
  );
  if (response.status === 404) throw new Error("order product not found");
  else if (response.status === 200) {
    const orderProduct = await response.json();
    return orderProduct;
  }
}

// Get all products of an order (manager, chef, cook or waiter of the restaurant)
export async function getProductsOfAnOrderService(orderId) {
  const token =
    localStorage.getItem("managertoken") ||
    localStorage.getItem("cheftoken") ||
    localStorage.getItem("waitertoken") ||
    localStorage.getItem("cooktoken");
  const response = await fetch(`${backendURL}/orders/${orderId}/order_products`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error("Some error has ocurred")
  else if (response.ok) {
    const data = await response.json()
    return data;
  }
}

// Create new order-product (manager or waiter of the restaurant)
export async function createOrderProductService(orderProductData) {
  const token =
    localStorage.getItem("managertoken") || localStorage.getItem("waitertoken");
  const newOrderProduct = {
    order_id: orderProductData.order_id,
    product_id: orderProductData.product_id,
    amount: orderProductData.amount,
    comment: orderProductData.comment,
  };
  const response = await fetch(`${backendURL}/order_products`, {
    method: "POST",
    body: JSON.stringify(newOrderProduct),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (response.status === 200) return response;
  const errorData = await response.json();
  throw new Error(errorData.message || "Some error has ocurred");
}

// Delete order-product (manager or waiter of the restaurant)
export async function deleteOrderProductService(orderProductId) {
  const token =
    localStorage.getItem("managertoken") || localStorage.getItem("waitertoken");
  const response = await fetch(
    `${backendURL}/order_products/${orderProductId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    },
  );
  if (response.status === 200) {
    const data = await response.json();
    return data.message;
  }
  const errorData = await response.json();
  throw new Error(errorData.message || "order product not found");
}

// Edit order-product (manager or waiter of the restaurant)
export async function editOrderProductService(
  orderProductId,
  orderProductData,
) {
  const token =
    localStorage.getItem("managertoken") || localStorage.getItem("waitertoken");
  const editedOrderProduct = {
    order_id: orderProductData.order_id,
    product_id: orderProductData.product_id,
    amount: orderProductData.amount,
    comment: orderProductData.comment,
  };
  const response = await fetch(
    `${backendURL}/order_products/${orderProductId}`,
    {
      method: "PUT",
      body: JSON.stringify(editedOrderProduct),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    },
  );
  if (response.status === 200) return response;
  const errorData = await response.json();
  throw new Error(errorData.message || "order product not found");
}
