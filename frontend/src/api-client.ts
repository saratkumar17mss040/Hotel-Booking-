import { RegisterFormDataType } from "./pages/Register";
import { SignInFormDataType } from "./pages/SignIn";
import {
  HotelSearchResponseType,
  HotelType,
} from "../../backend/src/shared/types";

// this is how vite imports env vars
// import.meta.env.VITE_API_BASE_URL || '' ensures that API_BASE_URL has a fallback value of an empty string if the environment variable is not set.
// initally, the frontend and backend was in different URLS, now since the backend bundles and serves the static assets of frontend - they will both be in the
// same URL. for handling dynamic routes - we have added catch all route in the server at the end
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
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error fetching hotel details");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching hotel details", (error as Error).message);
    throw error;
  }
};

export const fetchMyHotelById = async (hotelId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Error fetching Hotel by id");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching Hotel by id", (error as Error).message);
    throw error;
  }
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
      {
        method: "PUT",
        body: hotelFormData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update Hotel by id");
    }

    return response.json();
  } catch (error) {
    console.error("Failed to update Hotel by id", (error as Error).message);
    throw error;
  }
};

export type SearchParamsType = {
  destination: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  types?: string[];
  facilities?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (
  searchParams: SearchParamsType
): Promise<HotelSearchResponseType> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) =>
      queryParams.append("facilities", facility)
    );

    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(
      `${API_BASE_URL}/api/hotels/search?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Error searching and fetching hotels");
    }
    return response.json();
  } catch (error) {
    console.error("Failed to search hotel", (error as Error).message);
    throw error;
  }
};
