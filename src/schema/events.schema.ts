import mongoose, { Schema } from "mongoose";

// see validator details in middleware/events.validators.ts
const eventSchema = new Schema({
    name: {
        type: String,
        // validate: nameValidator,
    },
   /*  address: {
        type: String,
    }, */ // until we find a method to generate string addresses from lat/long coordinates, we will cease to use this field
    description: {
         type: String,
         default: ""
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
        type: String,
        enum: ["public", "private"],
        default: "public"
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