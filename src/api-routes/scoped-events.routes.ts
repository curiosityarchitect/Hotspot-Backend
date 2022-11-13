import { Router, Request, Response } from "express";
import { Events } from "../schema/events.schema"
import { Tag } from "../schema/tags.schema";
import { EventTag } from "../schema/eventTags.schema";
import { validateEventPost } from "../middleware/events.validator";
import bodyParser from "body-parser";

const scopedEventsRouter: Router = Router();
scopedEventsRouter.use(bodyParser.json());

scopedEventsRouter.route('/users/:userId/events').get((req: Request, res: Response) => {
    // fetch all attendee'd + invited events for the user from eventAttendees db
    // send AND(location, or(scope=public, eventid in eventids))

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

export default scopedEventsRouter;