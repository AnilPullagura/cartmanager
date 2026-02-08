import React, { useEffect, useState } from "react";

const API = "https://cartmanager.onrender.com/";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  const login = async () => {
    const res = await fetch(`${API}/users/login`, {
      method: "POST",

      body: JSON.stringify({ username: "anil", password: "123" }),
    });

    if (res.status !== 200) {
      alert("Invalid username/password");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const fetchItems = async () => {
    const res = await fetch(`${API}/items`);
    const data = await res.json();
    setItems(data);
  };

  const addToCart = async (id) => {
    await fetch(`${API}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ ItemID: id }),
    });
    alert("Added to cart");
  };

  const checkout = async () => {
    await fetch(`${API}/orders`, {
      method: "POST",
      headers: { Authorization: token },
    });
    alert("Order successful");
  };

  const showCart = async () => {
    const res = await fetch(`${API}/carts`, {
      headers: { Authorization: token },
    });
    alert(JSON.stringify(await res.json(), null, 2));
  };

  const showOrders = async () => {
    const res = await fetch(`${API}/orders`, {
      headers: { Authorization: token },
    });
    alert(JSON.stringify(await res.json(), null, 2));
  };

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded shadow w-80 text-center">
          <h1 className="text-2xl font-bold mb-6">Shop Login</h1>
          <button
            onClick={login}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="flex gap-4 mb-8">
        <button
          onClick={checkout}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Checkout
        </button>
        <button
          onClick={showCart}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Cart
        </button>
        <button
          onClick={showOrders}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Order History
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Items</h2>

      <div className="grid grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.ID}
            onClick={() => addToCart(item.ID)}
            className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
          >
            <h3 className="font-bold text-lg">{item.Name}</h3>
            <p className="text-gray-600">${item.Price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
