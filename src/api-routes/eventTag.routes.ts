import { Router, Request, Response, RequestHandler } from "express";
import { Tag } from "../schema/tags.schema"
import * as mongoose from "mongoose";
import { Events } from "../schema/events.schema"
import { EventTag } from "../schema/eventTags.schema";

const eventTagsRouter: Router = Router();

eventTagsRouter.route('/tags').post((req: Request, res: Response) => {
    const name = req.body.name;
    const id = req.body.id;
    Tag.find({
        name
    })
    .then()
    .catch(err => res.status(400).json("ERROR: tag could not be found"));
    Events.findById(id)
    .then()
    .catch(err => res.status(400).json("ERROR: event could not be found"))
    const newEventTag = new EventTag({
        name,
        id
    });
    newEventTag.save()
    .then(() => res.json('Tag is added to the event'))
    .catch(err => res.status(400).json("ERROR: tag could not be added"));
});