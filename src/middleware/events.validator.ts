import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

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
    ,
    body("latitude")
        .isNumeric()
        .withMessage("Latitude must be a number!")
    ,
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
    }
]