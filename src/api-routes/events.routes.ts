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

eventsRouter.route('/events').post((req: Request, res: Response) => {
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
            invitees: req.body.invitees,
            eventType: req.body.scope
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

const locationConstraints = (req: Request) => {
    if (!req.query.longitude || !req.query.latitude || !req.query.distance) {
        return null;
    }

    // return constraints based off of location
    return {
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
    }
}

const userPrivilegeConstraints = (req: Request) => {
    if (!req.query.userid) {
        return null;
    }
    // extract username
    return User.findById(req.query.userid)
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

    // return contraints based off visibility and user privilege
    .then((groupedIds) => {
            const orConditions: object[] = [{ '_id': { $in: groupedIds.flat() } }];
            if (!req.query.specific) {
                orConditions.push({ 'eventType': 'public' });
            }
            return {
                '$or': orConditions
            }
        }
    )
}

eventsRouter.route('/events').get((req: Request, res: Response) => {
    // gather Event query conditions based off location and user permission
    Promise.all([
        userPrivilegeConstraints(req),
        locationConstraints(req)
    ])
    // combine constraints into single object
    .then((constraintArr) =>
        constraintArr.reduce(
            (constraintObj, constraint) => Object.assign(constraintObj, constraint),
            {}
        )
    )
    // use constraints to query Events collection
    .then((constraints) =>
        Events.find(constraints)
    )
    // respond with query results
    .then((events) =>
        res.json(events)
    )

    .catch((err) => err.status(400).json(err));
});

eventsRouter.route('/events/:eventid').get((req: Request, res: Response) => {
    Events.findById(req.params.eventid)
        .then(event => res.json(event))
        .catch(err => res.status(400).json(err));
});

eventsRouter.route('/events/:eventid/arrivee').post((req:Request, res: Response) => {
    let errStatus = 400;
    Promise.all([
        Events.findById(req.params.eventid)
        .then(event => {
            if (!event) {
                errStatus = 404;
                throw new Error(`no event with _id ${req.params.eventid}`);
            }

            return event;
        }),

        User.findById(req.body.arriveeId)
        .then(user => {
            if (!user) {
                errStatus = 404;
                throw new Error(`no user with _id ${req.body.arriveeId}`);
            }

            return user;
        })
    ])
    .then((notificationInfo) => {
        Notifications.findOne({
            recepient: notificationInfo[0].creator.username,
            message: `${notificationInfo[1].username} has arrived at your event, ${notificationInfo[0].name}`,
            type: "event",
        })
        .then((notification) => {
            if (!notification) {
                const newNotification = new Notifications({
                    recepient: notificationInfo[0].creator.username,
                    message: `${notificationInfo[1].username} has arrived at your event, ${notificationInfo[0].name}`,
                    type: "event",
                });

                return newNotification.save();
            }
            return notification;
        })
    })
    .then(notification => res.json(notification))
    .catch(err => res.status(errStatus).json(err));
})

export default eventsRouter;