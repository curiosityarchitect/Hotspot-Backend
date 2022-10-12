import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    eventType: String,
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: [],
    },
    startDate: Date,
    endDate: Date
});

eventSchema.index({location: "2dsphere"});

export const Events = mongoose.model("Events", eventSchema);