import { useState } from "react";
import axios from "axios";

function Login({ close, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // ✅ backend response
      const data = response.data;

      // ✅ save token
      localStorage.setItem("token", data.token);

      // ✅ save user
      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

      // ✅ update app state
      setUser(data.user);

      alert("✅ Login successful!");

      close();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "❌ Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-[350px] shadow-2xl relative">

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-3 right-4 text-lg text-gray-500 hover:text-red-500"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Login
        </h2>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-lg"
            required
          />

          <button
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;