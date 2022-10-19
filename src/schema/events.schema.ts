import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: [],
    },
    numAttendees: {
        type: Number
    }
});

eventSchema.index({location: "2dsphere"});

export const Events = mongoose.model("Events", eventSchema);