const backendURL = import.meta.env.VITE_BACKEND_URL;
// GET all restaurants (manager)
export async function getRestaurantsService() {
  const managerToken = localStorage.getItem("managertoken");
  const response = await fetch(`${backendURL}/restaurants`, {
    headers: {
      Authorization: `Bearer ${managerToken}`,
    },
  });
  const data = response.json();
  return data;
}

// GET single restaurant (manager)
export async function getSingleRestaurantService(restaurantId) {
  const managerToken = localStorage.getItem("managertoken");
  const response = await fetch(`${backendURL}/restaurants/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${managerToken}`,
    },
  });
  if (response.status === 404) throw new Error("Restaurant not found");
  else if (response.status === 200) {
    const restaurant = await response.json();
    return restaurant;
  }
}

// Create new Restaurant (manager)
export async function createRestaurantService(restaurantData) {
  const managerToken = localStorage.getItem("managertoken");
  const newRestaurant = {
    name: restaurantData.name,
    email: restaurantData.email,
    phone: restaurantData.phone,
    address: restaurantData.address,
    img_url: restaurantData.img_url,
  };
  const response = await fetch(`${backendURL}/restaurants`, {
    method: "POST",
    body: JSON.stringify(newRestaurant),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${managerToken}`,
    },
  });
  if (response.status === 400) throw new Error("Some info is missing");
  else if (response.status === 200) return response;
}

// Delete Restaurant (manager)
export async function deleteRestaurantService(restaurantId) {
  const managerToken = localStorage.getItem("managertoken");
  const response = await fetch(`${backendURL}/restaurants/${restaurantId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${managerToken}`,
    },
  });
  if (response.status === 404) throw new Error("Restaurant not found");
  else if (response.status === 200) {
    const data = await response.json();
    return data.message;
  }
}

// Edit Restaurant (manager)
export async function editRestaurantService(restaurantId, restaurantData) {
  const managerToken = localStorage.getItem("managertoken");
  const editedRestaurant = {
    name: restaurantData.name,
    email: restaurantData.email,
    phone: restaurantData.phone,
    address: restaurantData.address,
    img_url: restaurantData.img_url,
  };
  const response = await fetch(`${backendURL}/restaurants/${restaurantId}`, {
    method: "PUT",
    body: JSON.stringify(editedRestaurant),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${managerToken}`,
    },
  });
  if (response.status === 404) throw new Error("Restaurant not found");
  else if (response.status === 200) return response;
}

/////////////////////////////////////////////////////////////
// Chef get his own restaurant
export async function chefGetRestaurantService(restaurant_id) {
  const chefToken = localStorage.getItem("cheftoken");
  const response = await fetch(`${backendURL}/my_restaurant/${restaurant_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${chefToken}`,
    },
  });
  if (response.status === 404) throw new Error("Restaurant not found");
  else if (response.status === 200) {
    const restaurant = await response.json();
    return restaurant;
  } else {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.msg || `Error ${response.status}`);
  }
}

// Chef create restaurant service
export async function chefCreateRestaurantService(restaurantData) {
  const chefToken = localStorage.getItem("cheftoken");
  const newRestaurant = {
    name: restaurantData.name,
    email: restaurantData.email,
    phone: restaurantData.phone,
    address: restaurantData.address,
    img_url: restaurantData.img_url,
  };
  const response = await fetch(`${backendURL}/create_restaurant`, {
    method: "POST",
    body: JSON.stringify(newRestaurant),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${chefToken}`,
    },
  });
  if (response.status === 400) throw new Error("Some info is missing");
  else if (response.status === 409)
    throw new Error("Chef alredy owns a restaurant");
  else if (response.status === 200) return response;
}

// Chef edits his own restaurant
export async function chefEditRestaurantService(restaurant_id, restaurantData) {
  const chefToken = localStorage.getItem("cheftoken");
  const editedRestaurant = {
    name: restaurantData.name,
    email: restaurantData.email,
    phone: restaurantData.phone,
    address: restaurantData.address,
    img_url: restaurantData.img_url,
  };
  const response = await fetch(
    `${backendURL}/edit_restaurant/${restaurant_id}`,
    {
      method: "PUT",
      body: JSON.stringify(editedRestaurant),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chefToken}`,
      },
    },
  );
  if (response.status === 404) throw new Error("Restaurant not found");
  else if (response.status === 200) return response;
}

// Chef delete his restaurant
export async function chefDeleteRestaurantService(restaurant_id) {
  const chefToken = localStorage.getItem("cheftoken");
  const response = await fetch(
    `${backendURL}/delete_restaurant/${restaurant_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${chefToken}`,
      },
    },
  );
  if (response.status === 404) throw new Error("Restaurant not found");
  else if (response.status === 200) {
    const data = await response.json();
    return data.message;
  }
}

// Chef edit coordinate and address of his restaurant
export async function editRestaurantCoordsService(restaurant_id, coordsData) {
  const dataToSend = {
    ...coordsData,
    latitude: Number(coordsData.latitude),
    longitude: Number(coordsData.longitude),
  };
  const chefToken = localStorage.getItem("cheftoken");
  const response = await fetch(
    `${backendURL}/restaurants/${restaurant_id}/location`,
    {
      method: "PATCH",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chefToken}`,
      },
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  const message = await response.json();
  return message;
}
