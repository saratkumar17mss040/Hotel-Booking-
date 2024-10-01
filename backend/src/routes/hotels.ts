import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponseType } from "../shared/types";

const router = express.Router();

type SortOptionType = "starRating" | "pricePerNightAsc" | "pricePerNightDesc";

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let querySortOptions = req.query.sortOption as SortOptionType | undefined;
    let sortOption = {};

    switch (querySortOptions) {
      // without a secondary sorting criterion, tied hotels will be displayed in an arbitrary order.
      // solution: createdAt (newest first) - createdAt: -1
      case "starRating": {
        // this represents sorting the result based on query - high to low
        sortOption = { starRating: -1, createdAt: -1 };
        break;
      }
      case "pricePerNightAsc": {
        // low to high
        sortOption = { pricePerNight: 1, createdAt: -1 };
        break;
      }
      case "pricePerNightDesc": {
        // high to low
        sortOption = { pricePerNight: -1, createdAt: -1 };
        break;
      }
      default:
        // Optional: Apply default sort if no valid sortOption is provided
        sortOption = { _id: 1, createdAt: -1 }; // Default sorting by _id (ascending)
        console.log("Invalid or missing sort option. Applying default sort.");
    }

    // for each page, we give 5 results
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    // no of items to skip based on pageNumber
    const skip = (pageNumber - 1) * pageSize;
    // order is important
    // If you skip before sorting, you would skip an arbitrary set of documents before knowing their order, which would result in an inconsistent and incorrect subset of data.
    // If you limit before sorting, the limit() would be applied to unsorted data, potentially cutting off documents that should appear in your sorted result.
    const hotels = await Hotel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);
    const response: HotelSearchResponseType = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;
