import { Router, Request, Response, RequestHandler } from "express";
import { friendRequest } from "../schema/friend-request.schema"
import { User } from "../schema/user.schema"


const friendRequestRouter: Router = Router();

friendRequestRouter.route('/friend-requests').post((req: Request, res: Response) => {
    const id = req.body.id;
    const deliver = req.body.deliver;
    const newRequest = new friendRequest ({
        id,
        deliver
    });
    // How to make the if statement. If there will be no users found, I would not make the newRequest.save
    User.findById(id)
    .then(() => {
        newRequest.save();
        res.json('Request has been sent!');
    })
    .catch(err => res.status(400).json("Error: No users found"));
});

friendRequestRouter.route('/friend-requests').get((req: Request, res: Response) => {
    const id = req.body.id;
    friendRequest.find({reciever: id})
    .then(friendReq => res.json(friendReq))
    .catch(err => res.status(400).json("Error: No requests found!"));
});

export default friendRequestRouter;