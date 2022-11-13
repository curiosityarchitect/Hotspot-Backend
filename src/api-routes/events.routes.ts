import { Router, Request, Response } from "express";
import { Events } from "../schema/events.schema"
import { Tag } from "../schema/tags.schema";
import { EventTag } from "../schema/eventTags.schema";
import { validateEventPost } from "../middleware/events.validator";
import bodyParser from "body-parser";

const eventsRouter: Router = Router();
eventsRouter.use(bodyParser.json());

eventsRouter.route('/events').post(validateEventPost, (req: Request, res: Response) => {
    const name = req.body.name;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;
    const tags: string[] = req.body.tags;
    const scope: string = req.body.scope;

    const newEvent = new Events(
    {
        name,
        location: {
            type: "Point",
            coordinates: [longitude, latitude]
        },
        numAttendees: req.body.numAttendees,
        eventType: {
            scope
        } 
    });

    newEvent.save()

    .then(event => {
        // simply respond with event document if no tags need to be added
        if (!tags) {
            res.json(event);
            return;
        }

        const eventid = event._id;

        // send series of queries to create necessary tags
        return Promise.all(tags.map((tag) => {
            return Tag.findOne({
                description: tag
            })
            .then((tagDoc) => {
                if (!tagDoc) {
                    const newTag = new Tag({
                            description: tag
                        });
                    return newTag.save();
                }
                return null;
            })

            // create new event tag document
            .then(() => {
                const newEventTag = new EventTag({
                    description: tag,
                    eventid
                });
                return newEventTag.save();
            })
        }))
        // after all tags have been added, return the event object
        .then(() => {
            res.json(event);
        })
    })

    // error catcher for promise chain
    .catch(err => res.status(400).json(err));
});

eventsRouter.route('/events').get((req: Request, res: Response) => {
    // if a location is defined in the query string, query database for events around that location
    if (req.query.longitude && req.query.latitude) {
        Events.find({
            location: {
                $near: {
                // if a distance is defined in query string, query database for events in that distance
                // defaults to a distance of 800 meters
                $maxDistance: req.query.distance ? req.query.distance : 800,
                $geometry: {
                    type: "Point",
                    coordinates: [req.query.longitude, req.query.latitude]
                    }
                }
            },
            eventType: {
                scope: "public"
            }
        })
        .then(event => res.json(event))
        .catch(err => res.status(400).json(err));
    }
    // otherwise, fetch all events
    else {
        Events.find()
        .then(events => res.json(events))
        .catch(err => res.status(400).json(err));
    }
});

eventsRouter.route('/events/:eventid').get((req: Request, res: Response) => {
    Events.findById(req.params.eventid)
    .then(event => res.json(event))
    .catch(err => res.status(400).json(err));
});

export default eventsRouter;