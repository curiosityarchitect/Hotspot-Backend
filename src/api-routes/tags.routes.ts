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
        let starts: object[] = [];
        let contains: object[] = [];
        const startRegex = `^(${req.query.search}).*`;
        const containsRegex = `.*(${req.query.search}).*`;
        Tag.find({
            name: {
                $regex : startRegex
            }
        })
        .lean() // returns a json not a document
        .then(tags => {
            starts = tags;

            // creates array of user IDs that have already been found
            const alreadyFound: mongoose.Types.ObjectId[] = tags.map(tag => tag._id);
            return Tag.find({
                name: {
                    $regex : containsRegex
                },
                _id: {
                    $nin : alreadyFound
                }
            }).lean();
        })
        .then(tags => {
            contains = tags;

            const result = starts.concat(contains);
            res.json(result);
        })
        .catch(err => res.status(400).json("Error: No tags found"));
    } else {
        Tag.find({})
        .then(tags => res.json(tags))
        .catch(err => res.status(400).json("Error: No tags found"));
    }
});

export default tagsRouter;