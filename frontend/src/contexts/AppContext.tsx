import React, { useContext } from "react";
import Toast from "../components/Toast";

type ToastMessageType = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContextType = {
  showToast: (toastMessage: ToastMessageType) => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

type childrenType = React.ReactNode;

export const AppContextProvider = ({
  children,
}: {
  children: childrenType;
}) => {
  const [toast, setToast] = React.useState<ToastMessageType | undefined>(
    undefined
  );
  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
      }}
    >
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
