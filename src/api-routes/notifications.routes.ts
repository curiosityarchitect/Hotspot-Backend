import { Router, Request, Response } from "express";
import {Notifications} from "../schema/notification.schema"

const notificationRouter: Router = Router();

notificationRouter.route('/notifications/:recepient').get((req: Request, res: Response) => {
    const recepient = req.params.recepient;
    Notifications.find({recepient})
        .then((notifications) => res.json(notifications))
        .catch(err => res.status(400).json(err));
});


notificationRouter.route('/notifications').post((req: Request, res: Response) => {
    Notifications.findOne({
        recepient: req.body.recepient,
        message: req.body.message,
        type: req.body.type,
    })
    .then(notification => {
        if (!notification) {
            const newNotification = new Notifications({
                recepient: req.body.recepient,
                message: req.body.message,
                type: req.body.type,
            });
            return newNotification.save()
        }
        return notification;
    })
    .then(() => res.json('Notification added'))
    .catch(err => res.status(400).json("ERROR: notification could not be added"));
});

notificationRouter.route('/notifications/:username').delete((req: Request, res: Response) => {
    Notifications.findOneAndDelete({
        recepient: req.params.username,
    })
        .then(() => res.json('Notifications cleared'))
        .catch(err => res.status(400).json("ERROR: notifications could not be cleared"));
});

export default notificationRouter;