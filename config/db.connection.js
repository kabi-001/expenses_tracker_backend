import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

// Force Google DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const DBconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log("dbconnected");
    console.log("mongo server:", process.env.MONGO_URI);
  } catch (error) {
    console.log("Mongo Error:", error);
  }
};