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
    .catch(err => res.status(400).json(err))
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
    .catch(err => res.status(400).json(err))

    // check eventid exists
    .then(() => {
        return Events.findById(eventid);
    })
    .catch(err => res.status(400).json(err))
    .then((event) => {
        if (event == null)
            throw new Error("no event with specified eventid");
        
            return null;
    })

    // create new event tag if needed
    .catch(err => res.status(400).json(err))
    .then(() => {
        const newEventTag = new EventTag({
            description,
            eventid
        });
        return newEventTag.save();
    })
    .then((tag) => res.json(tag))
    .catch(err => res.status(400).json(err));
});

export default eventTagsRouter;