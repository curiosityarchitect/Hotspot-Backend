import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

export const Events = mongoose.model("Events", eventSchema);