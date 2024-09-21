import { useFormContext } from "react-hook-form";
import { HotelFormDataType } from "./ManageHotelForm";

export default function ImagesSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormDataType>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          id="imageFiles"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length;
              if (totalLength === 0) {
                return "Alteast one image should be added";
              }

              if (totalLength > 6) {
                return "Total number of images cannot be more than 6";
              }
              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles && (
            <span className="text-red-500 text-sm font-bold">
              {errors.imageFiles.message}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
