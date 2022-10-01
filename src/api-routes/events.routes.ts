import { Router } from "express";
import { Events } from "../models/events.model"

const eventsRouter = Router();

eventsRouter.route('/events').post((req, res) => {
    const eventName: string = req.body.eventName;
    const newEvent = new Events({name: "Evan's BETTER evant"});

    newEvent.save()
    .then(event => res.json(event))
    .catch(err => res.status(400).json("ERROR: event could not be added"));
});

eventsRouter.route('/events').get((req, res) => {
    Events.find({})
    .then(events => res.json(events));
});

export default eventsRouter;

