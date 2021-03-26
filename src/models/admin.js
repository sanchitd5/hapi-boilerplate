import mongoose, { Schema } from "mongoose";
import Config from "../config"

const admin = new Schema({
    emailId: { type: String, unique: true, sparse: true },
    fullName: { type: String },
    password: { type: String, required: true },
    userType: {
        type: String, enum: [
            Config.APP_CONSTANTS.DATABASE.USER_ROLES.SUPERADMIN,
            Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
        ]
    },
    initialPassword: { type: String },
    firstLogin: { type: Boolean, default: false },
    createdAt: { type: Date, required: true, default: Date.now },
    isBlocked: { type: Boolean, default: false, required: true }
});

export default mongoose.model('admin', admin);