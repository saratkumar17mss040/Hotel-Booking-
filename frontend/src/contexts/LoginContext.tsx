import { createContext, useState, useEffect, useContext } from "react";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";

interface LoginContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
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

  useEffect(() => {
    if (isError) {
      console.error("Error validating token:", error);
      setIsLoggedIn(false);
    }
  }, [isError, error, setIsLoggedIn]);

  return {
    data,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    isError,
    isSuccess,
  };
};
