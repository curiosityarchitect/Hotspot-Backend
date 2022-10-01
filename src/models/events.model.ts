import mongoose, { Schema } from "mongoose";
let Location = require("location.ts");

const eventSchema = new Schema({
    name: String,
    location: Location
});

const Events = mongoose.model("Events", eventSchema);

module.exports = Events;