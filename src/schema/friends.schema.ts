import mongoose, { Schema } from "mongoose";

const friendsSchema = new Schema({
    username1: {type: String, required: true},
    username2: {type: String, required: true},
});


export const friends = mongoose.model("friends", friendsSchema);