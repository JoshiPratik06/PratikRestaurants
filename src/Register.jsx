import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function Register({ close, openLogin }) {
  const { register, handleSubmit, reset } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "/api/auth/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );

      alert("✅ Registration Successful!");

      console.log(response.data);

      reset();

      close();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "❌ Registration failed"
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
        aria-label="Create account"
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

        <h2 className="font-display text-2xl font-extrabold">Create your account</h2>
        <p className="mt-1 text-sm text-[#6b7468]">It takes a minute, and saves your orders.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <label className="text-sm font-semibold">
            Full name
            <input
              type="text"
              {...register("name", { required: true })}
              className="mt-1.5 w-full rounded-md border border-[#e3e1d6] px-3 py-3 font-normal focus:border-[#17251d] focus:outline-none"
            />
          </label>
          <label className="text-sm font-semibold">
            Email
            <input
              type="email"
              {...register("email", { required: true })}
              className="mt-1.5 w-full rounded-md border border-[#e3e1d6] px-3 py-3 font-normal focus:border-[#17251d] focus:outline-none"
            />
          </label>
          <label className="text-sm font-semibold">
            Phone (optional)
            <input
              type="tel"
              {...register("phone")}
              className="mt-1.5 w-full rounded-md border border-[#e3e1d6] px-3 py-3 font-normal focus:border-[#17251d] focus:outline-none"
            />
          </label>
          <label className="text-sm font-semibold">
            Password
            <input
              type="password"
              {...register("password", { required: true })}
              className="mt-1.5 w-full rounded-md border border-[#e3e1d6] px-3 py-3 font-normal focus:border-[#17251d] focus:outline-none"
            />
          </label>
          <button
            disabled={loading}
            className="mt-2 rounded-md bg-[#17251d] py-3 font-bold text-white hover:bg-[#22372b] disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {openLogin && (
          <p className="mt-5 text-center text-sm text-[#6b7468]">
            Already have an account?{" "}
            <button onClick={openLogin} className="font-bold text-[#17251d] underline">
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;