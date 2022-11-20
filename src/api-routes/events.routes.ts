import { Router, Request, Response } from "express";
import { Events } from "../schema/events.schema"
import { validateEventPost } from "../middleware/events.validator";
import {Tag} from "../schema/tags.schema";
import {EventTag} from "../schema/eventTags.schema";
import bodyParser from "body-parser";
import { Notifications } from "../schema/notification.schema";
import { User } from "../schema/user.schema";
import { ObjectId } from "mongoose";
import { Attendees } from "../schema/rsvp.schema";
import mongoose from "mongoose";

const eventsRouter: Router = Router();
eventsRouter.use(bodyParser.json());

eventsRouter.route('/events').post(validateEventPost, (req: Request, res: Response) => {
    const tags: string[] = req.body.tags;
    const invitees: string[] = req.body.invitees;
    const newEvent = new Events(
        {
            name: req.body.name,
            address: req.body.address,
            description: req.body.description,
            location: {
                type: "Point",
                coordinates: [req.body.longitude, req.body.latitude]
            },
            creator: {
                username: req.body.username,
            },
            numAttendees: req.body.numAttendees,
            capacity: req.body.capacity,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            cover: req.body.cover,
        }
    );

    newEvent.save()
    .then(event => {
        // simply respond with event document if no tags need to be added
        if (!tags ) {
            res.json(event);
            return;
        }

        const eventid = event._id;

        // send series of queries to create necessary tags
        return Promise.all(tags.map((tag) =>
            Tag.findOne({
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
        ))

        // after all tags have been added, return the event object
        .then(() => {
            res.json(event);
        })

    })

    // send series of queries to send notifications
    .then(() => {
        if(!invitees) {
            return null;
        }

        return Promise.all(invitees.map((invitee) => {
            const newNotification = new Notifications({
                recepient: invitee,
                message: `${req.body.username} invited you to ${req.body.name}!`,
                type: "event",
            });
            return newNotification.save();
        }));
    })

    // error catcher for promise chain
    .catch(err => res.status(400).json(err));
});

eventsRouter.route('/events').get((req: Request, res: Response) => {
    // if a userid is provided, then query database only for events that user should have access to
    if (req.query.userid) {

        // extract username
        User.findById(req.query.userid)
        .then((user) => {
            if (!user) {
                throw new Error();
            }
            return user.username;
        })

        // gather eventids the user should have specific access to
        .then((username) =>
            Promise.all([
                // query for events the user is attending
                Attendees.find({'username': username})
                .then((rsvps) =>
                    rsvps.map((rsvp) => rsvp.eventid)
                ),

                // query for events the user owns
                Events.find({ 'creator': { 'username': username }} )
                .then((events) =>
                    events.map((event) => event._id)
                )
            ])
        )

        .then((groupedIds) =>
            Events.find({
                $or: [
                    { 'eventType': 'public' },
                    { '_id': { $in: groupedIds.flat() }}
                ]
            })
        )

        .then((events) => {
            res.json(events);
        })

        .catch((err) => {
            res.status(400).json(err);
        })

    }

    // if a location is defined in the query string, query database for events around that location
    else if (req.query.longitude && req.query.latitude) {
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