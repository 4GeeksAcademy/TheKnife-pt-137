const backendURL = import.meta.env.VITE_BACKEND_URL;

// GET all cooks
export async function getCooksService() {
  const response = await fetch(`${backendURL}/cooks`);
  const data = response.json();
  return data;
}

// GET single cook
export async function getSingleCookService(cookId) {
  const response = await fetch(`${backendURL}/cooks/${cookId}`);
  if (response.status === 404) throw new Error("Cook not found");
  else if (response.status === 200) {
    const cook = await response.json();
    return cook;
  }
}

// Create new cook
export async function createCookService(cookData) {
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

// Delete cook
export async function deleteCookService(cookId) {
  const response = await fetch(`${backendURL}/cooks/${cookId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 404) throw new Error("Cook not found");
  else if (response.status === 200) {
    const data = await response.json();
    return data.message;
  }
}

// Edit cook
export async function editCookService(cookId, cookData) {
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
    },
  });
  if (response.status === 404) throw new Error("Cook not found");
  else if (response.status === 200) return response;
}
