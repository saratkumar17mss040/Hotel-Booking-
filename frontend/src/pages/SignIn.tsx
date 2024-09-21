import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormDataType = {
  email: string;
  password: string;
};

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormDataType>();

  const { showToast, setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      console.log("user has been signed in");
      // await queryClient.invalidateQueries("validateToken");
      // show the toast
      showToast({ type: "SUCCESS", message: "Sign in successful !" });
      setIsLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", "true");
      // navigate to home page
      navigate("/");
    },
    onError: (error: Error) => {
      // show the toast
      console.error("Error during sign-in:", error);
      showToast({ type: "ERROR", message: "Sign in failed" });
      setIsLoggedIn(false);
      sessionStorage.setItem("isLoggedIn", "false");
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label htmlFor="email" className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          id="email"
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label
        htmlFor="password"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Password
        <input
          id="password"
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be 6 characters or more",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not Registered ?{" "}
          <Link className="underline" to="/register">
            Create an account here
          </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Sign In
        </button>
      </span>
    </form>
  );
}
