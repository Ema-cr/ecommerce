import mongoose, { Document, Schema } from "mongoose";

interface Engine {
  type: string;
  fuel: string;
  hp: number;
  transmission: string;
}

interface Car extends Document {
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  engine: Engine;
  mileage: number;
  condition: "New" | "Used";
  imageUrl: string;
  dealerId: string;
  status: "Available" | "Sold" | "Reserved";
  tags: string[];
  createdAt: Date;
}

const carSchema: Schema = new Schema(
  {
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    engine: {
      type: {
        type: String,
        required: true,
      },
      fuel: { type: String, required: true },
      hp: { type: Number, required: true },
      transmission: { type: String, required: true },
    },
    mileage: { type: Number, default: 0 },
    condition: { type: String, enum: ["New", "Used"], default: "Used" },
    imageUrl: { type: String, required: true },
    dealerId: { type: String, default: "" },
    status: { type: String, enum: ["Available", "Sold", "Reserved"], default: "Available" },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Car || mongoose.model<Car>("Car", carSchema);
