import mongoose, { Schema } from "mongoose";

//see validator details in middleware/events.validators.ts
const eventSchema = new Schema({
    name: {
        type: String, 
        validate: nameValidator,
    },
    description: {
         type: String, 
         validate: descValidator,
    },
    location: {
         //find way to pull coordinates from google maps to string format of location
         loc: {
            type: String,
            enum: ["Point"], //extend functionality of app later? (loc types) -> 'popular', 'favorite', etc.
            validate: locationValidator
        }, 
        coordinates: {
            type: [], 
            required: true, //validate is internally done here
            validate: [coordinateValidation,'coordinates should be numbers as: latitude, longitude'],
        }
    },
    creator: { 
        username: {String, validate: creatorValidator},
        dateCreated:{
            type: Date,
            validate: createDateValidator,
        },
    },
    eventType: {
        scope: {
            type: String,
            enum: ["public", "private"],
            validate: eventScopeValidator,
        },
        groupEvent: {
            type: Boolean,
            default: false,
            validate: groupEventValidator,
        }
    },
    capacity: {
        type: Number,
        validate: capacityValidator,
    },
    expiration: {
        type: Date,
        validate: [expirationValidator, 'Expiration date must be in the future'],
    }
   
});

eventSchema.index({location: "2dsphere"});

export const Events = mongoose.model("Events", eventSchema);