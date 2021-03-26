import mongoose, { Schema } from "mongoose";

const user = new Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  emailId: { type: String, trim: true, required: true, unique: true },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    index: true,
    min: 5,
    max: 15
  },
  password: { type: String },
  initialPassword: { type: String },
  firstLogin: { type: Boolean, default: false },
  countryCode: { type: String },
  code: { type: String, trim: true },
  OTPCode: { type: String, trim: true },
  emailVerified: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  codeUpdatedAt: { type: Date, default: Date.now, required: true },
  isBlocked: { type: Boolean, default: false, required: true }
});

export default mongoose.model("user", user);
