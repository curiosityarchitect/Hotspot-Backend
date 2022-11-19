import { Router, Request, Response, RequestHandler } from "express";
import * as mongoose from "mongoose";
import bodyParser from "body-parser";
import { User } from "../schema/user.schema";
import { friends as Friends } from "../schema/friends.schema";

const friendLocationRouter: Router = Router();
friendLocationRouter.use(bodyParser.json());

friendLocationRouter.route('/users/:userId/friends/locations').get((req: Request, res: Response) => {
    let errStatus = 400;
    let username: string;

    User.findById(req.params.userId)
    .then((user) => {
        if (!user) {
            errStatus = 404;
            throw new Error(`no user with _id ${req.params.userId}`);
        }
        username = user.username;
    })

    // find all friendships concerning this user
    .then(() =>
        Friends.find({
            $or: [ { username1 : username }, { username2 : username } ]
        })
    )
    // extract friend usernames
    .then((friends) =>
        friends.map((friend) => friend.username1 === username ? friend.username2 : friend.username1)
    )

    // retrieve location and username of each friend
    .then((friendUsernames) =>
        User.find({ username: { $in: friendUsernames }})
        .select(['_id', 'username', 'location'])
    )

    // send response
    .then((locationData) => {
        res.json(locationData)
    })
    .catch((err) => res.status(errStatus).json(err))
});

export default friendLocationRouter;