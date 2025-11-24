import mongoose from "mongoose";

const engineSchema = new mongoose.Schema({
  type: { type: String, required: true },
  fuel: { type: String, required: true },
  hp: { type: Number, required: true },
  transmission: { type: String, required: true },
});

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    engine: { type: engineSchema, required: true },
    mileage: { type: Number, default: 0 },
    condition: { type: String, enum: ["New", "Used"], default: "Used" },
    imageUrl: { type: String, required: true },
    status: { type: String, enum: ["Available", "Sold", "Reserved"], default: "Available" },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Car || mongoose.model("Car", carSchema);
