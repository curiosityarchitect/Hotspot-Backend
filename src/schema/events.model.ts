import mongoose, { Schema } from "mongoose";
import { Point } from "./point.model";

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: Point,
        required: true
    }
});

eventSchema.index({location: "2dsphere"});

export const Events = mongoose.model("Events", eventSchema);