import { Router, Request, Response, RequestHandler } from "express";
import { friendRequest } from "../schema/friend_request.schema"
import { User } from "../schema/user.schema"


const fr_reqRouter: Router = Router();

fr_reqRouter.route('/friend-requests').post((req: Request, res: Response) => {
    const reciever = req.body.reciever;
    const deliver = req.body.deliver;
    const newRequest = new friendRequest ({
        reciever,
        deliver
    });
    //How to make the if statement. If there will be no users found, I would not make the newRequest.save
    User.find({username: reciever})
    .then(() => {
        newRequest.save();
        res.json('Request has been sent!');
    })
    .catch(err => res.status(400).json("Error: No users found"));
});

fr_reqRouter.route('/friend-requests').get((req: Request, res: Response) => {
    const username = req.body.username;
    friendRequest.find({reciever: username})
    .then(fr_req => res.json(fr_req))
    .catch(err => res.status(400).json("Error: No requests found!"));
});

export default fr_reqRouter;