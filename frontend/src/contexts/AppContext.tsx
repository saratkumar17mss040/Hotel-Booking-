import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type ToastMessageType = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContextType = {
  showToast: (toastMessage: ToastMessageType) => void;
  isLoggedIn: boolean | undefined;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

type childrenType = React.ReactNode;

export const AppContextProvider = ({
  children,
}: {
  children: childrenType;
}) => {
  console.log("AppContext Provider render");

  const [toast, setToast] = useState<ToastMessageType | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    sessionStorage.getItem("isLoggedIn") === "true"
  );

  // Check localStorage for initial login state
  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn !== null) {
      setIsLoggedIn(storedIsLoggedIn === "true");
    }
  }, []);

  useEffect(() => {
    console.log("isLoggedIn value changed:", isLoggedIn);
  }, [isLoggedIn]);

  const { isError, isLoading } = useQuery(
    "validateToken",
    apiClient.validateToken,
    {
      retry: false,
      enabled: isLoggedIn === true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      onSuccess: () => {
        // Update `isLoggedIn` and localStorage on successful validation
        console.log("success");
        if (!isLoggedIn) {
          setIsLoggedIn(true);
          sessionStorage.setItem("isLoggedIn", "true");
        }
      },
      onError: (error) => {
        // Update `isLoggedIn` and localStorage on failed validation
        console.log("failed", error);
        if (isLoggedIn) {
          setIsLoggedIn(false);
          sessionStorage.removeItem("isLoggedIn");
        }
      },
    }
  );

  const showToast = useCallback((toastMessage: ToastMessageType) => {
    setToast(toastMessage);
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      isLoggedIn,
      setIsLoggedIn,
    }),
    [showToast, isLoggedIn, setIsLoggedIn] // Dependencies
  );

  return (
    <AppContext.Provider value={contextValue}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context as AppContextType;
};
