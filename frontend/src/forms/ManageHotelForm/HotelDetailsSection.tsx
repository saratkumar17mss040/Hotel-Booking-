import { useFormContext } from "react-hook-form";
import { HotelFormDataType } from "./ManageHotelForm";

export default function HotelDetailsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormDataType>();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
      <label htmlFor="email" className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input
          id="name"
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>
      <div className="flex gap-4">
        <label
          htmlFor="city"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          City
          <input
            id="city"
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("city", { required: "This field is required" })}
          />
          {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
          )}
        </label>
        <label
          htmlFor="country"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          Country
          <input
            id="country"
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("country", { required: "This field is required" })}
          />
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </label>
      </div>
      <label
        htmlFor="description"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Description
        <textarea
          rows={10}
          id="description"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("description", { required: "This field is required" })}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>
      <label
        htmlFor="price-per-night"
        className="text-gray-700 text-sm font-bold flex-1 max-w-[50%]"
      >
        Price Per Night
        <input
          type="number"
          min={1}
          id="price-per-night"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("pricePerNight", { required: "This field is required" })}
        />
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>
      <label
        htmlFor="star-rating"
        className="text-gray-700 text-sm font-bold flex-1 max-w-[50%]"
      >
        Star rating
        <select
          {...register("starRating", {
            required: "This field is required",
          })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
          name="starRating"
          id="star-rating"
        >
          <option key={0} value="" className="text-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((num) => {
            return (
              <option key={num} value={num}>
                {num}
              </option>
            );
          })}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message}</span>
        )}
      </label>
    </div>
  );
}
