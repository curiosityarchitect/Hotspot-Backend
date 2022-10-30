import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema({
    description: {
        type: String,
        required: true,
        minlength: 3
    }
});

export const Tag = mongoose.model("Tag", tagSchema);