const backendURL = import.meta.env.VITE_BACKEND_URL;

// GET all cooks (manager)
export async function getCooksService() {
  const managerToken = localStorage.getItem("managertoken");
  const response = await fetch(`${backendURL}/cooks`, {
    headers: {
      "Authorization": `Bearer ${managerToken}`,
    },
  });
  const data = response.json();
  return data;
}

// GET single cook (manager)
export async function getSingleCookService(cookId) {
  const managerToken = localStorage.getItem("managertoken");
  const response = await fetch(`${backendURL}/cooks/${cookId}`, {
    headers: {
      "Authorization": `Bearer ${managerToken}`,
    },
  });
  if (response.status === 404) throw new Error("Cook not found");
  else if (response.status === 200) {
    const cook = await response.json();
    return cook;
  }
}

// Create new cook (manager CRUD)
export async function createCookService(cookData) {
  const managerToken = localStorage.getItem("managertoken");
  const newCook = {
    name: cookData.name,
    email: cookData.email,
    password: cookData.password,
    restaurant_id: cookData.restaurant_id,
  };
  const response = await fetch(`${backendURL}/cooks`, {
    method: "POST",
    body: JSON.stringify(newCook),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${managerToken}`,
    },
  });
  if (response.status === 400) throw new Error("Some info is missing");
  else if (response.status === 200) return response;
}

// Cook login
export async function cookLoginService(cookLoginData) {
    const cookLogin = {
        email: cookLoginData.email,
        password: cookLoginData.password
    }
    const response = await fetch(`${backendURL}/cook_login`, {
        method: "POST",
        body: JSON.stringify(cookLogin),
        headers: {"Content-Type": "application/json"}
    })
    if (!response.ok) throw new Error("Some error has ocurred")
    else if (response.ok) {
        const data = await response.json()
        return data;
    }
}

// Delete cook (manager)
export async function deleteCookService(cookId) {
  const managerToken = localStorage.getItem("managertoken");
  const response = await fetch(`${backendURL}/cooks/${cookId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${managerToken}`,
    },
  });
  if (response.status === 404) throw new Error("Cook not found");
  else if (response.status === 200) {
    const data = await response.json();
    return data.message;
  }
}

// Edit cook (manager)
export async function editCookService(cookId, cookData) {
  const managerToken = localStorage.getItem("managertoken");
  const editedCook = {
    name: cookData.name,
    email: cookData.email,
    password: cookData.password,
  };
  const response = await fetch(`${backendURL}/cooks/${cookId}`, {
    method: "PUT",
    body: JSON.stringify(editedCook),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${managerToken}`,
    },
  });
  if (response.status === 404) throw new Error("Cook not found");
  else if (response.status === 200) return response;
}

/////////////////////////////////////////////////////////////////////////////
// Chef registers a cook
export async function cookRegisterService(restaurant_id, cookData) {
    const chefToken = localStorage.getItem("cheftoken")
    const newCook = {
        name: cookData.name,
        email: cookData.email,
        password: cookData.password
    }
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/cook_register`, {
        method: "POST",
        body: JSON.stringify(newCook),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chefToken}`
        }
    })
    console.log(response)
    if (!response.ok) throw new Error("Some error has ocurred")
    else if (response.ok) {
        const data = await response.json()
        return data
    }
}

// Chef can see cooks of his restaurant
export async function getRestaurantCooksService(restaurant_id) {
  const chefToken = localStorage.getItem("cheftoken")
  const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/cooks`, {
    methods: "GET",
    headers: {
      "Authorization": `Bearer ${chefToken}`
    }
  })
  if (!response.ok) throw new Error("Some error has ocurred")
  else if (response.ok) {
    const data = await response.json()
    return data
  }
}

// Chef can delete a cook of his restaurant
export async function deleteRestaurantCookService(restaurant_id, cook_id) {
  const chefToken = localStorage.getItem("cheftoken")
  const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/cooks/${cook_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${chefToken}`
    }
  })
  if (!response.ok) throw new Error("Some error has ocurred")
  else if (response.ok) {
    const data = await response.json()
    return data
  }
}