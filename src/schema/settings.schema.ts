import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema({

    displayName: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    displayLocation : { type: String, required: false },
    username: { type: String, required: false },
    profTags: { type: String, required: false }, // change to array of strings for future implementation


});

export const ProfileChanges = mongoose.model("ProfileChanges", settingsSchema);