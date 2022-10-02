import { Router, Request, Response, RequestHandler } from "express";
import { Events } from "../schema/events.model"
import { validateEvent } from "../middleware/events.validator";
import bodyParser from "body-parser";

const eventsRouter: Router = Router();
eventsRouter.use(bodyParser.json());

eventsRouter.route('/events').post(validateEvent, (req: Request, res: Response) => {
    const newEvent = new Events({name: req.body.name});

    newEvent.save()
    .then(event => res.json(event))
    .catch(err => res.status(400).json("ERROR: event could not be added"));
});

eventsRouter.route('/events').get((req: Request, res: Response) => {
    Events.find({})
    .then(events => res.json(events));
});

export default eventsRouter;

