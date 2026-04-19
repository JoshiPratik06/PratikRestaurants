import { useState, useEffect } from "react";

function Login({ close, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
  e.preventDefault();

  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // find matching user
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid email or password ❌");
      return;
    }

    // ✅ save logged in user
    localStorage.setItem("currentUser", JSON.stringify(user));

    setUser(user);

    alert("✅ Login successful!");

    close();
  } catch (error) {
    console.error(error);
    alert("❌ Login error");
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[350px] shadow-xl relative">
        
        <button
          onClick={close}
          className="absolute top-3 right-4 text-lg"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onInput={(e) => setEmail(e.target.value)}
            className="p-3 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            className="p-3 border rounded"
          />

          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;