import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 7
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true,

});

export const User = mongoose.model("User", userSchema);