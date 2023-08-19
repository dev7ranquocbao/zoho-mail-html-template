import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectionString = process.env.MONGODB_URI || "";

mongoose.connect(connectionString);
const database = mongoose.connection;

export default database;
