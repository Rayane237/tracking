import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const admin = await User.create({
  name: "Admin",
  email: "admin@dubaiglobalexpress.com",
  password: "Admin@2026",
  role: "admin"
});

console.log("Utilisateur créé :", admin.email);

await mongoose.disconnect();