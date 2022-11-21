import mongoose, { Schema } from "mongoose";

// see validator details in middleware/events.validators.ts
const eventSchema = new Schema({
    name: {
        type: String,
        // validate: nameValidator,
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
    // startDate: Date,
    // endDate: Date,
    startTime: {
        type: String,
        // validate: nameValidator,
    },
    endTime: {
        type: String,
        // validate: nameValidator,
    },
    startDate: {
        type: String,
        // validate: nameValidator,
    },
    endDate: {
        type: String,
        // validate: nameValidator,
    },
    creator: {
        username: {String, /*validate: creatorValidator*/},
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
    }
});

eventSchema.index({location: "2dsphere"});

export const Events = mongoose.model("Events", eventSchema);