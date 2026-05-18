import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function Register({ close }) {
  const { register, handleSubmit, reset } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://pratikrestaurants.onrender.com/api/auth/register",
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-[350px] p-8 rounded-2xl shadow-2xl relative">
        
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", { required: true })}
            className="p-3 rounded-lg border"
          />

          <input
            type="email"
            placeholder="Email Address"
            {...register("email", { required: true })}
            className="p-3 rounded-lg border"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            {...register("phone")}
            className="p-3 rounded-lg border"
          />

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="p-3 rounded-lg border"
          />

          <button
            disabled={loading}
            className="mt-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;