import { Router, Request, Response, RequestHandler } from "express";
import { Tag } from "../schema/tags.schema"
import * as mongoose from "mongoose";

const tagsRouter: Router = Router();

tagsRouter.route('/tags').post((req: Request, res: Response) => {
    const name = req.body.name;

    const newTag = new Tag({
        name
    });
    newTag.save()
    .then(() => res.json('Tag added'))
    .catch(err => res.status(400).json("ERROR: tag could not be added"));
});


tagsRouter.route('/tags').get((req: Request, res: Response) => {
    if (req.query.search) {
        const containsRegex = `.*(${req.query.search}).*`;
        Tag.find({
            description: {
                $regex : containsRegex
            }
        })
        .then(tags => res.json(tags))
        .catch(err => res.status(400).json("Error: No tags found"));
    } else {
        Tag.find({})
        .then(tags => res.json(tags))
        .catch(err => res.status(400).json("Error: No tags found"));
    }
});




export default tagsRouter;