import { Router, Request, Response, RequestHandler } from "express";
import { friendRequest } from "../schema/friend-request.schema"
import {friends} from "../schema/friends.schema"
import { User } from "../schema/user.schema"


const friendRequestRouter: Router = Router();

friendRequestRouter.route('/friend-requests').post((req: Request, res: Response) => {
    const reciever = req.body.reciever;
    const deliverer = req.body.deliverer;
    const newRequest = new friendRequest ({
        reciever,
        deliverer
    });
    // How to make the if statement. If there will be no users found, I would not make the newRequest.save
    User.find({username: reciever})
    .then(() => {
        newRequest.save();
        res.json('Request has been sent!');
    })
    .catch(err => res.status(400).json("Error: No users found"));
});
// handle yes/no for friend request
friendRequestRouter.route('/friend-requests/status/:username').post((req: Request, res: Response) => {
    const username = req.params.username;
    const friendRelation = new friends ({
        username1 : username,
        username2: req.body.username
    });
    friendRequest.findOneAndDelete({username1: username, username2: req.body.username}) // if the request is accepted, delete the request
    .then(() => {
        friendRelation.save();
        res.json('Request has been accepted!');
    })
    .catch(err => res.status(400).json("Error: No requests found!"));
});
friendRequestRouter.route('/friend-requests/status/:username').get((req: Request, res: Response) => {
    const username = req.params.username;
    friends.find({username1: username,username2: req.body.username})
    .then(
        friendRelation => res.json(friendRelation) // see if user2 is already friends with user1
    )
    .catch(err => res.status(400).json("Error: No requests found!"));
});


friendRequestRouter.route('/friend-requests').get((req: Request, res: Response) => {
    const username = req.body.username;
    friendRequest.find({reciever: username})
    .then(friendReq => res.json(friendReq))
    .catch(err => res.status(400).json("Error: No requests found!"));
});

export default friendRequestRouter;