import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import { HotelFormDataType } from "./ManageHotelForm";

export default function FacilitiesSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormDataType>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-5 gap-5">
        {hotelFacilities.map((facility) => {
          return (
            <label
              className="text-sm flex items-center gap-1 text-gray-700"
              key={facility}
              htmlFor={facility}
            >
              <input
                type="checkbox"
                value={facility}
                {...register("facilities", {
                  validate: (facilities) => {
                    if (facilities && facilities.length > 0) {
                      return true;
                    } else {
                      return "Atleast one facility is required";
                    }
                  },
                })}
              />
              {facility}
            </label>
          );
        })}
      </div>
      {errors.facilities && (
        <span className="text-red-500 text-sm font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
}
