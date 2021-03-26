import { Schema, model } from "mongoose";
import Config from "../config"

const token = new Schema({
    deviceType: { type: String, enum: Object.values(Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES), required: true },
    accessToken: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true,
        sparse: true
    },
    deviceUUID: {
        type: String,
        required: true,
    },
    deviceName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    adminId: { type: Schema.Types.ObjectId, ref: 'admin' },
});

export default model('token', token);