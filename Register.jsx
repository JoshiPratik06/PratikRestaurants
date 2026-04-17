import { useForm } from "react-hook-form";

function Register({ close }) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
  try {
    // get existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // check if email already exists
    const existingUser = users.find((u) => u.email === data.email);

    if (existingUser) {
      alert("User already exists with this email ❌");
      return;
    }

    // create new user with id
    const newUser = {
      id: Date.now(),
      ...data,
    };

    // save users
    localStorage.setItem(
      "users",
      JSON.stringify([...users, newUser])
    );

    alert("✅ Registration Successful!");

    reset();
    close();
  } catch (error) {
    console.error(error);
    alert("❌ Registration error");
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

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
            {...register("phone", { required: true })}
            className="p-3 rounded-lg border"
          />

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="p-3 rounded-lg border"
          />

          <button className="mt-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold">
            Register
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;