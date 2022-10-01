import { Router } from "express";
import { Events } from "../models/events.model"

const eventsRouter = Router();

eventsRouter.route('/events').post(() => {
    Events.create({name: "Evan's evant hahaha"});
});

eventsRouter.route('/events').get((req, res) => {
    Events.find({})
    .then(events => res.json(events));
});

export default eventsRouter;

