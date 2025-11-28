import mongoose, { Schema, Document, models } from "mongoose";
import { IUser } from "@/services/types";


const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    cart: { type: [Schema.Types.Mixed], default: [] },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.User || mongoose.model<IUser>("User", UserSchema);
