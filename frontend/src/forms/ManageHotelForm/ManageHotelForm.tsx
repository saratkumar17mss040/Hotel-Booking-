import { FormProvider, useForm } from "react-hook-form";
import HotelDetailsSection from "./HotelDetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormDataType = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageURLS: string[];
  adultCount: number;
  childCount: number;
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

export default function ManageHotelForm({ onSave, isLoading, hotel }: Props) {
  const formMethods = useForm<HotelFormDataType>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (hotel) {
      console.log(hotel);
      reset(hotel);
    }
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formData: HotelFormDataType) => {
    // create new formData object & call the api
    console.log(formData);
    const formDataObj = new FormData();
    if (hotel) {
      formDataObj.append("hotelId", hotel._id);
    }
    formDataObj.append("name", formData.name);
    formDataObj.append("city", formData.city);
    formDataObj.append("country", formData.country);
    formDataObj.append("description", formData.description);
    formDataObj.append("type", formData.type);
    formDataObj.append("pricePerNight", formData.pricePerNight.toString());
    formDataObj.append("adultCount", formData.adultCount.toString());
    formDataObj.append("childCount", formData.childCount.toString());
    formDataObj.append("starRating", formData.starRating.toString());

    formData.facilities.forEach((facility, index) => {
      formDataObj.append(`facilities[${index}]`, facility);
    });

    if (formData.imageURLS) {
      formData.imageURLS.forEach((url, index) => {
        formDataObj.append(`imageURLS[${index}]`, url);
      });
    }

    Array.from(formData.imageFiles).forEach((imageFile) => {
      // as imageFiles are binary, we can just keep on appending, multer package on backend wil take care of it
      formDataObj.append("imageFiles", imageFile);
    });

    onSave(formDataObj);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <HotelDetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
}
