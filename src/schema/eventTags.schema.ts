import mongoose, { Schema } from "mongoose";

const eventTagsSchema = new Schema({
    description: {
        type: String,
        required: true,
        minlength: 3
    },
    eventid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
        required: true
    }
});

export const EventTag = mongoose.model("EventTag", eventTagsSchema);