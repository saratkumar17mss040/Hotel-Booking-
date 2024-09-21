/* 
import { createContext, useState, useEffect, useContext, useMemo } from "react";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";

interface LoginContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

// const getInitialIsLoggedIn = () => {
//   const storedValue = localStorage.getItem("isLoggedIn");
//   return storedValue === "true"; // Convert string 'true' to boolean true
// };

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    console.log("init log");
    return false;
  });
  const value = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn]);

  // useEffect(() => {
  //   localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  // }, [isLoggedIn]);

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  console.log("called");

  const context = useContext(LoginContext);

  if (context === undefined) {
    throw new Error(
      "useLoginContext must be used within an LoginContextProvider"
    );
  }

  const { isLoggedIn, setIsLoggedIn } = context;

  // this query will run only if isLoggedIn is true
  const { data, isLoading, error, isError, isSuccess } = useQuery(
    "validateToken",
    apiClient.validateToken,
    {
      enabled: isLoggedIn,
      retry: false,
    }
  );

  // useEffect(() => {
  //   if (isError) {
  //     console.error("Error validating token:");
  //     setIsLoggedIn(false);
  //   }
  // }, [isError, error, setIsLoggedIn]);

  return {
    data,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    isError,
    isSuccess,
  };
};
*/
