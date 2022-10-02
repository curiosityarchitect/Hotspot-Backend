import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateEvent = [
    body("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Events require a name!")
    ,
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
    }
]