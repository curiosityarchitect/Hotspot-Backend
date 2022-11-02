import { Router, Request, Response } from "express";
import { Attendees } from "../schema/rsvp.schema"
import { Events } from "../schema/events.schema"
import bodyParser from "body-parser";

const RsvpRouter: Router = Router();
RsvpRouter.use(bodyParser.json());

RsvpRouter.route('/events/:eventid/attendees').post((req: Request, res: Response) => {

    const newAttendee = new Attendees(
        {
            username: req.body.username,
            eventid: req.params.eventid,
            numAttendees: req.body.numAttendees,

        });
         newAttendee.save()
        .then(rsvp => res.json(rsvp))
        .then(() => {
            const newNumAttendees = req.body.numAttendees + 1;
            if (req.params.numAttendees < req.params.capacity){
                return Events.findOneAndUpdate({ _id: req.params.eventid }, { $set: { numAttendees: newNumAttendees } }, { new: true })
            }
            else {
                throw new Error("Event is at max capacity");
            }
        })
        .catch(err => res.status(400).json(err));


});

RsvpRouter.route('/events/:eventid/attendees').get((req: Request, res: Response) => {
    const eventid = req.params.eventid;
    Attendees.find({ eventid, username: 'alexwu' })
        .then((rsvp) => res.json(rsvp))
        .catch(err => res.status(400).json(err));

});

export default RsvpRouter;