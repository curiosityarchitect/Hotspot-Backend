import { body, CustomValidator, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const checkLongitude: CustomValidator = (longitude: number) => {
    return !(longitude < -180 || longitude > 180)
};

const checkLatitude: CustomValidator = (latitude: number) => {
    return !(latitude < -90 || latitude > 90);
};

const checkPositive: CustomValidator = (num: number) => {
    return num >= 0;
};

export const validateEventPost = [
    body("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Events require a name!")
    ,
    body("longitude")
        .isNumeric()
        .withMessage("Longitude must be a number!")
        .bail()
        .custom(checkLongitude)
        .withMessage("Longitude must be between -180 and 180, inclusive!")
    ,
    body("latitude")
        .isNumeric()
        .withMessage("Latitude must be a number!")
        .bail()
        .custom(checkLatitude)
        .withMessage("Latitude must be between -90 and 90, inclusive!")
    ,
    body("numAttendees")
        .isNumeric()
        .withMessage("Number of attendees must be a number!")
        .custom(checkPositive)
    ,
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
    }
]