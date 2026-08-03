const backendURL = import.meta.env.VITE_BACKEND_URL;

// GET all order-products
export async function getOrderProductsService() {
  const response = await fetch(`${backendURL}/order_products`);
  const data = response.json();
  return data;
}

// GET single order-product
export async function getSingleOrderProductService(orderProductId) {
  const response = await fetch(
    `${backendURL}/order_products/${orderProductId}`,
  );
  if (response.status === 404) throw new Error("order product not found");
  else if (response.status === 200) {
    const orderProduct = await response.json();
    return orderProduct;
  }
}

// Get all products of an order
export async function getProductsOfAnOrderService(orderId) {
  const response = await fetch(`${backendURL}/orders/${orderId}/order_products`)
  if (!response.ok) throw new Error("Some error has ocurred")
  else if (response.ok) {
    const data = await response.json()
    return data;
  }
}

// Create new order-product
export async function createOrderProductService(orderProductData) {
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
    },
  });
  if (response.status === 400) throw new Error("Some info is missing");
  else if (response.status === 200) return response;
}

// Delete order-product
export async function deleteOrderProductService(orderProductId) {
  const response = await fetch(
    `${backendURL}/order_products/${orderProductId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (response.status === 404) throw new Error("order product not found");
  else if (response.status === 200) {
    const data = await response.json();
    return data.message;
  }
}

// Edit order-product
export async function editOrderProductService(
  orderProductId,
  orderProductData,
) {
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
      },
    },
  );
  if (response.status === 404) throw new Error("order product not found");
  else if (response.status === 200) return response;
}
