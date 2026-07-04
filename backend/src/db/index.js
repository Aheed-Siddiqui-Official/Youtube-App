import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI?.trim().replace(/^['"]|['"]$/g, "");

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }

    const connectionInstance = await mongoose.connect(`${mongoUri}/${DB_NAME}`);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance}`);
    console.log(connectionInstance.connection.host);
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export default connectDB