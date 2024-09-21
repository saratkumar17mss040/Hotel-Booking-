import { RegisterFormDataType } from "./pages/Register";
import { SignInFormDataType } from "./pages/SignIn";
import { HotelType } from "../../backend/src/shared/types";

// this is how vite imports env vars
// import.meta.env.VITE_API_BASE_URL || '' ensures that API_BASE_URL has a fallback value of an empty string if the environment variable is not set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormDataType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      // the credentials: include will allow us to send cookies and also set cookies in the browser when response is received
      // actual process will be handled by the browser. we just specify the configuration
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if (!response.ok) {
      console.error("Error during registration: ", responseBody.message);
      throw new Error(responseBody.message);
    }
    console.log("Registration successful: ", responseBody);
  } catch (error) {
    console.error("Error during registration: ", (error as Error).message);
    throw error;
  }
};

export const signIn = async (formData: SignInFormDataType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(responseBody.message);
    }
    console.log("Sign-in successful: ", responseBody);
    return responseBody;
  } catch (error) {
    console.error("Error during sign-in: ", (error as Error).message);
    throw error;
  }
};

export const validateToken = async () => {
  console.log("validate token");
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Invalid token");
    }
    console.log("Validated token successfully");
  } catch (error) {
    console.error("Error during validating token: ", (error as Error).message);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error during sign-out");
    }
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Error during sign-out: ", (error as Error).message);
    throw error;
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      method: "POST",
      credentials: "include",
      body: hotelFormData,
    });

    console.log(response.ok);

    if (!response.ok) {
      throw new Error("Error during adding hotel");
    }
    return response.json();
  } catch (error) {
    console.error("Error during adding hotel", (error as Error).message);
    throw error;
  }
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching details");
  }

  return response.json();
};
