import { Schema } from "mongoose";

const locationSchema = new Schema({
    latitude: {
        required: true,
        type: Number
    },
    longitude: {
        required: true,
        type: Number
    }
})