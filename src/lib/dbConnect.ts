import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI no está definida en el archivo .env");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    return await mongoose.connect(MONGODB_URI, {
      dbName: "gt_automarket",
    });
  } catch (error) {
    console.error("Error conectando MongoDB:", error);
  }
};
