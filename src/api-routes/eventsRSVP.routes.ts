import { Router, Request, Response } from "express";
import { Attendees } from "../schema/rsvp.schema"
import { Events } from "../schema/events.schema"
import bodyParser from "body-parser";
import { User } from "../schema/user.schema";
import {Notifications} from "../schema/notification.schema";

const RsvpRouter: Router = Router();
RsvpRouter.use(bodyParser.json());

RsvpRouter.route('/events/:eventid/attendees').post((req: Request, res: Response) => {
    const eventId = req.params.eventid
    return Events.findById(eventId)
    .then((event) => {
        if (!event) {
            throw new Error();
        }
        return event;
    }).then((event) => {
        const attending = event.numAttendees + 1;
        const capacity = event.capacity;
        if (event.numAttendees >= capacity) {
            throw new Error("Event is full");
        }
        else{
            Events.findOneAndUpdate({_id: eventId}, {numAttendees: attending})
            .then((reservation) => {
                if (!reservation) {
                    throw new Error(`no event with id ${eventId}`);
                }
            })
            .then(() => {
                const newAttendee = new Attendees(
                    {
                        username: req.body.username,
                        eventid: req.params.eventid,
                        numAttendees: attending,
                    }
                );
                    return newAttendee.save();
        }
        ).then(() => {
            const newNotification = new Notifications({
                recepient: event.creator.username,
                message: `${req.body.username} has RSVP'd to your event, ${event.name}`,
                type: "event",
            });
            return newNotification.save();
        }
        )
        .then((attendee) => res.json(attendee))
        .catch(err => res.status(400).json(err));
    }
    })
});

// query by eventid
RsvpRouter.route('/events/:eventid/attendees').get((req: Request, res: Response) => {
    const eventid = req.params.eventid;
    Attendees.find({ eventid })
        .then((rsvp) => res.json(rsvp))
        .catch(err => res.status(400).json(err));
});

// query by username
RsvpRouter.route('/events/:eventid/:username').get((req: Request, res: Response) => {
    const username = req.params.username;
    const eventid = req.params.eventid;
    Attendees.find({ eventid, username })
        .then((rsvp) => res.json(rsvp))
        .catch(err => res.status(400).json(err));
});

// unrsvp
RsvpRouter.route('/events/:eventid/:username').delete((req: Request, res: Response) => {
    const username = req.params.username;
    const eventid = req.params.eventid;
    Promise.all([
        Attendees.updateMany({ eventid}, {$inc: {numAttendees: - 1}}),
        Attendees.findOneAndRemove({ eventid, username }),
    ])
    .then((rsvp) => {
        if (!rsvp) {
            throw new Error(`no rsvp with username ${username} and eventid ${eventid}`);
        }
        res.json("Successfully cancelled RSVP");
    })
    Events.findById(eventid)
    .then((event) => {
        if (!event) {
            throw new Error();
        }
        return event;
    }).then((event) => {
        const attending = event.numAttendees - 1;
        Events.findByIdAndUpdate({_id: eventid}, { numAttendees: attending })
        .then((reservation) => {
            if (!reservation) {
                throw new Error(`no event with id ${eventid}`);
            }
        }
        )
        .then(() => {
            const newNotification = new Notifications({
                recepient: event.creator.username,
                message: `${req.params.username} has cancelled their RSVP to your event, ${event.name}`,
                type: "event",
            });
            newNotification.save();
        })
        .catch(err => res.status(400).json(err));
    }
    )
});

RsvpRouter.route('/user/:userid/events/attending').get((req: Request, res: Response) => {
    let errStatus = 400;

    User.findById(req.params.userid)
    .then((user) => {
        if (!user) {
            errStatus = 404;
            throw new Error(`no user with _id ${req.params.userid}`);
        }
        return user.username;
    })
    .then((username) =>
        Attendees.find({ username })
        .select(['eventid'])
    )
    .then((eventidObjects) =>
        eventidObjects.map((eventidObject) => eventidObject.eventid)
    )
    .then((eventids) =>
        Events.find({
            '_id': { $in: eventids }
        })
    )
    .then((events) => res.json(events))
    .catch(err => res.status(errStatus).json(err));
});


export default RsvpRouter;

