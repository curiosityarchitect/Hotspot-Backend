import mongoose, { Schema } from "mongoose";

const profTagSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }
});

export const profTag = mongoose.model("profTag", profTagSchema);