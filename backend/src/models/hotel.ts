import mongoose from "mongoose";

export type HoteType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  // These two fields will be added by ourselves in the server. so, no need to validate while getting from user input - will see 
  imageURLS: string[];
  lastUpdated: Date;
};

const hotelSchema = new mongoose.Schema<HoteType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  imageURLS: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
});

const Hotel = mongoose.model<HoteType>("Hotel", hotelSchema);
export default Hotel;
