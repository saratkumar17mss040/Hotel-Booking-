import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

export default function AddHotel() {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ type: "SUCCESS", message: "Hotel saved !" });
    },
    onError: () => {
      showToast({
        type: "ERROR",
        message: "Error saving hotel, Please make sure you are logged in",
      });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  console.log("Add hotel");
  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
}
