import mongoose, { Schema, ObjectId } from "mongoose";

const notificationSchema = new Schema({
    recepient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        minLength: 5,
        requied: true
    }
});


export const Notifications = mongoose.model("Notifications", notificationSchema);