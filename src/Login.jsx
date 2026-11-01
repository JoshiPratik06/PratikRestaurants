import { useState } from "react";
import axios from "axios";

function Login({ close, setUser, openRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/auth/login",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Log in"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-[#17251d] shadow-2xl"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#6b7468] hover:bg-[#f6f5ef] hover:text-[#17251d]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <h2 className="font-display text-2xl font-extrabold">Welcome back</h2>
        <p className="mt-1 text-sm text-[#6b7468]">Log in to check out and see your orders.</p>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          <label className="text-sm font-semibold">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#e3e1d6] px-3 py-3 font-normal focus:border-[#17251d] focus:outline-none"
              required
            />
          </label>
          <label className="text-sm font-semibold">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#e3e1d6] px-3 py-3 font-normal focus:border-[#17251d] focus:outline-none"
              required
            />
          </label>
          <button
            disabled={loading}
            className="mt-2 rounded-md bg-[#17251d] py-3 font-bold text-white hover:bg-[#22372b] disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        {openRegister && (
          <p className="mt-5 text-center text-sm text-[#6b7468]">
            New here?{" "}
            <button onClick={openRegister} className="font-bold text-[#17251d] underline">
              Create an account
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;