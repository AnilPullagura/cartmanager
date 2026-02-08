import React, { useEffect, useState } from "react";

const API = "https://cartmanager.onrender.com/";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [items, setItems] = useState([]);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  const register = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    const res = await fetch(`${API}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.status !== 200) {
      setError("Registration failed");
      return;
    }

    setError("");
    alert("Registration successful! Now login.");
    setIsRegister(false);
    setUsername("");
    setPassword("");
  };

  const login = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    const res = await fetch(`${API}users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.status !== 200) {
      setError("Invalid username/password");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setError("");
    setUsername("");
    setPassword("");
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
          <h1 className="text-2xl font-bold mb-6">
            {isRegister ? "Register" : "Shop Login"}
          </h1>

          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2 mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2 mb-6"
          />

          <button
            onClick={isRegister ? register : login}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setUsername("");
              setPassword("");
            }}
            className="text-blue-600 text-sm w-full"
          >
            {isRegister
              ? "Already have an account? Login"
              : "New user? Register"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shop</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setToken("");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

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
