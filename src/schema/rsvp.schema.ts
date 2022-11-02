import mongoose, { Schema } from "mongoose";

const attendeesSchema = new Schema({

    username: { type: String, required: true },
    eventid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
        required: true
    },
    numAttendees : { type: Number, required: true },


});

export const Attendees = mongoose.model("Atendees", attendeesSchema);