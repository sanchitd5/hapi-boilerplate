import mongoose, { Schema } from "mongoose";
import universalFunctions from "../utils/universalFunctions"


var forgetPasswordRequests = new Schema({
    customerID: { type: Schema.ObjectId, ref: 'users' },
    userType: {
        type: String,
        enum: [
            universalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER
        ],
        required: true
    },
    isChanged: { type: Boolean, default: false },
    requestedAt: { type: Date },
    changedAt: { type: Date }
});

module.exports = mongoose.model('forgetPasswordRequests', forgetPasswordRequests);