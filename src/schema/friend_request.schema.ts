import mongoose, { Schema } from "mongoose";

const friendRequestSchema = new Schema({
    reciever: {
        type: String,
        required: true,
        minlength: 3
    },
    deliver: {
        type: String,
        required: true,
        minlength: 3
    }
});

export const friendRequest = mongoose.model("friendRequest", friendRequestSchema);