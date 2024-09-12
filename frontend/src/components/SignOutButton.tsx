import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useLoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

export default function SignOutButton() {

  const { showToast } = useAppContext();
  const { setIsLoggedIn } = useLoginContext();
  const navigate = useNavigate();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: () => {
      // show the toast
      console.log("Signed out successfully");
      showToast({ type: "SUCCESS", message: "Sign out successful !" });
      setIsLoggedIn(false);
      navigate("/");
    },
    onError: (error: Error) => {
      // show the toast
      console.log("Error during sign-out:", error);
      showToast({ type: "ERROR", message: "Sign out failed" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
    >
      Sign out
    </button>
  );
}
