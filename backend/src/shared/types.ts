export type HotelType = {
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

export type HotelSearchResponseType = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
