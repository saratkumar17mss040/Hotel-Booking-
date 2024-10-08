import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import cookieParser from "cookie-parser";
import path from "path";
import configureExternalServices from "./config";

// Initialize all external services
configureExternalServices();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Connected to database: ", process.env.MONGODB_CONNECTION_STRING);
});

const port = process.env.BACKEND_PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// through cors, we have mentioned only to process req from this frontend URL
// and there needs to be cookies to be sent. so even if somehow, someone got our cookie - mostly very hard
// they still wont be able to access our backend because of our frontend URL - origin is fixed
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// using express.static middleware, we are serving the entire frontend static asset
// much similar to how we serve api endpoints
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// app.get("/api/test", async (req: Request, res: Response) => {
//   res.json({ msg: "hello from express application" });
// });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);

// Catch all route apart from above routes - this is added so that, dynamic protected routes can be served - tt's necessary as in build itself
// all components will be bundled, even if conditional components are there.

// This catch-all route ensures that any route,
// whether directly accessed, refreshed, or navigated to, results in index.html being served, so React can handle the routing.
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(port, () => console.log("server started on port 3000"));

export default app;
