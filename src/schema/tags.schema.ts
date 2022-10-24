import mongoose, { Schema } from "mongoose";

const tagsSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    }
});

export const Tag = mongoose.model("Tag", tagsSchema);