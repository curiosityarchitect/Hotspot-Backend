import mongoose, { Schema } from "mongoose";

// see validator details in middleware/events.validators.ts
const eventSchema = new Schema({
    name: {
        type: String,
        // validate: nameValidator,
    },
    address: {
        type: String,
    },
    description: {
         type: String,
         // validate: descValidator,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: [],
    },
    startDate: Date,
    endDate: Date,
    creator: {
        username: {
            type: String,
            /*validate: creatorValidator*/
        },
        dateCreated:{
            type: Date,
            // validate: createDateValidator,
        },
    },
    eventType: {
        scope: {
            type: String,
            enum: ["public", "private"],
            // validate: eventScopeValidator,
        },
        groupEvent: {
            type: Boolean,
            default: false,
            // validate: groupEventValidator,
        }
    },
    numAttendees: {
        type: Number
    },
    capacity: {
        type: Number,
        // validate: capacityValidator,
    },
    expiration: {
        type: Date,
        // validate: [expirationValidator, 'Expiration date must be in the future'],
    },
    cover:{
        type: String,
    },
    invitees: {
        type: [String],
        // validate: inviteesValidator need to create - must be userID
    },

});

eventSchema.index({location: "2dsphere"});

export const Events = mongoose.model("Events", eventSchema);