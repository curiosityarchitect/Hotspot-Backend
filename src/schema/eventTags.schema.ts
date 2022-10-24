import mongoose, { Schema } from "mongoose";

const eventTagsSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    id: {
        type: String,
        required: true,
        minlength: 3
    }
});

export const EventTag = mongoose.model("EventTag", eventTagsSchema);