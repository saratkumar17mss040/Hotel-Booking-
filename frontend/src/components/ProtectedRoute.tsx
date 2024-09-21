import { Navigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, showToast } = useAppContext();
  console.log(isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      // Trigger the toast if the user is not logged in
      showToast({ type: "ERROR", message: "Please login" });
    }
  }, [isLoggedIn, showToast]); // Add dependencies to avoid triggering multiple times

  return isLoggedIn ? children : <Navigate to="/sign-in" />;
}
