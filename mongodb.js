import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectionString =
  "mongodb+srv://dev7r4nquocbao:RUEnrxodwy1qj3Hv@zoho-template-freelance.1xyyfgv.mongodb.net/zoho_template?retryWrites=true&w=majority";

mongoose.connect(connectionString);
const database = mongoose.connection;

export default database;
