import { Router, Request, Response } from "express";
import { Events } from "../schema/events.schema"
import { validateEventPost } from "../middleware/events.validator";
import bodyParser from "body-parser";

const eventsRouter: Router = Router();
eventsRouter.use(bodyParser.json());

eventsRouter.route('/events').post(validateEventPost, (req: Request, res: Response) => {
    const newEvent = new Events(
    {
        name: req.body.name,
        location: {
            type: "Point",
            coordinates: [req.body.longitude, req.body.latitude]
        }
    });

    newEvent.save()
    .then(event => res.json(event))
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