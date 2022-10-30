import { Router, Request, Response, RequestHandler } from "express";
import { Tag } from "../schema/tags.schema"
import { Events } from "../schema/events.schema"
import { EventTag } from "../schema/eventTags.schema";
import bodyParser from "body-parser";

const eventTagsRouter: Router = Router();
eventTagsRouter.use(bodyParser.json());

eventTagsRouter.route('/events/:eventid/tags').post((req: Request, res: Response) => {
    const eventid = req.params.eventid;
    const description: string = req.body.description;

    // maintain Tag collection invariant (all tags must exist in "tag" and be unique)
    Tag.findOne({
        description
    })
    .then((tag) => {
        if (!tag) {
            const newTag = new Tag(
                {
                    description
                });
            return newTag.save();
        }
        return null;
    })

    // check eventid exists
    .then(() => {
        return Events.findById(eventid);
    })
    .then((event) => {
        if (event == null) {
            throw new Error("no event with specified eventid");
        }
        return null;
    })

    // check if event tag already exists
    .then(() => {
        return EventTag.findOne({
            description,
            eventid
        });
    })

    // create new event tag document if needed
    .then((tag) => {
        if (!tag) {
            const newEventTag = new EventTag({
                description,
                eventid
            });
            return newEventTag.save();
        }
        return tag;
    })
    .then((tag) => res.json(tag))

    // error handler for chain
    .catch(err => res.status(400).json(err));
});

export default eventTagsRouter;