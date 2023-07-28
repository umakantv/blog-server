import mongoose from "mongoose";
import config from "../config/index";

// Step 1. Connect to DB
export async function connectDatabase() {
  return new Promise<boolean>((resolve, reject) => {
    // protocol://hostname:port/db_name
    // protocol://username@password:hostname:port/db_name

    mongoose.connect(config.DB_CONNECTTION_STRING, (err) => {
      if (err) {
        console.log("Error conencting to DB");
        reject(err);
      } else {
        console.log("Successfully connected to DB");
        resolve(true);
      }
    });
  });
}
