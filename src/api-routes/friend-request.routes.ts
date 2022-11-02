import { Router, Request, Response, RequestHandler } from "express";
import { friendRequest } from "../schema/friend-request.schema"
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

friendRequestRouter.route('/friend-requests').get((req: Request, res: Response) => {
    const username = req.body.username;
    friendRequest.find({reciever: username})
    .then(friendReq => res.json(friendReq))
    .catch(err => res.status(400).json("Error: No requests found!"));
});

export default friendRequestRouter;