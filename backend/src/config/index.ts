import configureCloudinary from "./cloudinaryConfig";

const configureExternalServices = () => {
  configureCloudinary();
  // Add other services (e.g., AWS, Stripe, etc.) here
};

export default configureExternalServices;
