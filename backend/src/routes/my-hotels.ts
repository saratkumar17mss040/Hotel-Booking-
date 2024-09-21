import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HoteType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body, Meta } from "express-validator";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    // 1 KB = 1024 bytes.
    // 1 MB = 1024 KB = 1024 * 1024 bytes = 1,048,576 bytes.
    // 5 MB = 5 * 1,048,576 bytes = 5,242,880 bytes.
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

const atleastOneAdultCountOrChildCount = (value: any, meta: Meta) => {
  const { adultCount, childCount } = meta.req.body;

  if (adultCount === undefined && childCount === undefined) {
    throw new Error(
      "At least one of adultCount or childCount must be provided"
    );
  }
  return true;
};

// If these fields aren't the same in the HTML form and on your server, your upload will fail - upload() middleware
// The array of files will be stored in req.files.

// api/my-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("adultCount")
      .notEmpty()
      .isInt()
      .withMessage("Adult count must be a number"),
    body("childCount")
      .notEmpty()
      .isInt()
      .withMessage("Child count must be a number"),
    body().custom(atleastOneAdultCountOrChildCount),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("starRating")
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage("Star rating must be an integer between 1 and 5"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  // no need to add validation for imageFiles as multer will take care if it is greater than 6 files, it will throw an error
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];

      // Potential Issues:

      // TypeScript will not automatically validate that req.body matches the HoteType. It only ensures that you treat newHotel as if it conforms to HoteType in your code.
      // However, since the data in req.body comes from the user, there's no guarantee it will fully match the expected structure, which can lead to runtime issues.

      //   No Error Reporting:
      //   Mongoose won’t report errors if there’s a mismatch between TypeScript types and Mongoose schema because TypeScript and Mongoose operate in different phases
      //   (compile-time vs. runtime).
      //   To ensure consistency between TypeScript types and Mongoose schemas, you should manually keep them aligned.
      //   There are also tools and practices, such as schema validation libraries or code generation tools, that can help synchronize these definitions if needed.

      // Solution

      // You should validate and sanitize the req.body before assigning it to newHotel. This can be done using libraries like Joi, Yup, or express-validator

      const newHotel: HoteType = req.body;

      // 1. upload the images to cloudinary using - base64
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      newHotel.imageURLS = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // 2. if upload was successful, add the URLS to the new hotel
      // 3. save the new hotel in our database
      // 4. return a 201 status
      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).json(hotel);
    } catch (error) {
      console.error("Error creating hotel: ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
