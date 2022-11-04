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
    friends.findOne({username1: reciever, username2: deliverer}) // handle duplicate friend requests
    .then((relation) => {
        if (relation === null) {
            newRequest.save();
            res.json('Request has been sent!');
        }
        else {
            res.json('You are already friends!');
        }
    })
    .catch(err => res.status(err).json("Error: No users found"));
});
// handle yes/no for friend request

// accept
friendRequestRouter.route('/friend-requests/status/:username/accept').post((req: Request, res: Response) => {
    const username = req.params.username;
    const deliverer = req.body.deliverer;
    const friendRelation = new friends ({
        username1 : username,
        username2: deliverer
    }); // if the request is accepted, delete the request and create friend relation
     friendRequest.findOneAndDelete({reciever: username, deliverer})
    .then(() => {
        return friends.findOne({username1: username, username2: deliverer})
    })
    .then((newFriend) => {
        if (newFriend === null) {
            friendRelation.save();
            res.json('Request has been accepted!');
        } else {
            res.json('You are already friends!');
        }
    })
    .catch(err => res.status(err).json("Error: No requests found!"));
});

// decline
friendRequestRouter.route('/friend-requests/status/:username/decline').post((req: Request, res: Response) => {
    const username1 = req.params.username;
    const username2 = req.body.username;
    friendRequest.findOneAndDelete({reciever: username1, deliverer: username2}) // if the request is declined, delete the request and dont create friend relation
    .then(() => {
        res.json('Request has been rejected!');
    })
    .catch(err => res.status(err).json("Error: No requests found!"));
});



friendRequestRouter.route('/friend-requests/status/:username').get((req: Request, res: Response) => {
    const username = req.params.username;
    friends.findOne({username1: username,username2: req.body.username})
    .then(
        friendRelation => res.json(friendRelation) // see if user2 is already friends with user1
    )
    .catch(err => res.status(err).json("Error: No relation found"));
});


friendRequestRouter.route('/friend-requests/:username').get((req: Request, res: Response) => {
    const username = req.params.username;
    friendRequest.find({reciever: username})
    .then(friendReq => res.json(friendReq))
    .catch(err => res.status(err).json("Error: No requests found!"));
});

export default friendRequestRouter;