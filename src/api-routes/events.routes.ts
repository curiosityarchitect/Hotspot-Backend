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
    Events.find({})
    .then(events => res.json(events))
    .catch(err => res.status(400).json(err));
});

eventsRouter.route('/events/:eventid').get((req: Request, res: Response) => {
    Events.findById(req.params.eventid)
    .then(event => res.json(event))
    .catch(err => res.status(400).json(err));
});

eventsRouter.route('/events/:longitude/:latitude').get((req: Request, res: Response) => {
    Events.find({
        location: {
            $near: {
            $maxDistance: 200,
            $geometry: {
                type: "Point",
                coordinates: [req.params.longitude, req.params.latitude]
                }
            }
        }
    })
    .then(event => res.json(event))
    .catch(err => res.status(400).json(err));
});

export default eventsRouter;

