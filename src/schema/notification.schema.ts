import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    recepient: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
});


export const Notifications = mongoose.model("Notifications", notificationSchema);