import mongoose, { Schema } from "mongoose";

const eventInviteSchema = new Schema({
    _id: {
        type: String,

    },
    reciever: {
        type: String,
        required: true,
        minlength: 3
    },
    deliverer: {
        type: String,
        required: true,
        minlength: 3
    }
});

export const friendRequest = mongoose.model("eventInvite", eventInviteSchema);