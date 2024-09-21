import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormDataType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast, setIsLoggedIn } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormDataType>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      // these two will run at the same time, because we have placed the data in the context
      // we will see the toast even as the page transistion to home page
      showToast({ type: "SUCCESS", message: "Registration successful !" });
      setIsLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", "true");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ type: "ERROR", message: error.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label
          htmlFor="firstName"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          First Name
          <input
            id="firstName"
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label
          htmlFor="lastName"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          Last Name
          <input
            id="lastName"
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
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
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label
        htmlFor="confirmPassword"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Confirm Password
        <input
          id="confirmPassword"
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Passwords do not match";
              }
              // if we dont return anything, then validation passes
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create account
        </button>
      </span>
    </form>
  );
}
