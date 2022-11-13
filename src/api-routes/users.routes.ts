import { Router, Request, Response, RequestHandler } from "express";
import { User } from "../schema/user.schema"

const userRouter: Router = Router();

userRouter.route('/users').get((req: Request, res: Response) => {
    User.find({})
    .then(users => res.json(users))
    .catch(err => res.status(400).json("Error: No users found"));
});

userRouter.route('/users').post((req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        username,
        password,
        locationKnown: false,
        location: {
            type: "Point",
            coordinates: []
        }
    });
    newUser.save()
    .then(() => res.json('User added'))
    .catch(err => res.status(400).json("ERROR: user could not be added"));
});

userRouter.route('/users/:userId').get((req: Request, res: Response) => {
    User.findById(req.params.userId)
    .then(user => res.json(user))
    .catch(err => res.status(400).json(err));
});

userRouter.route('/users/:userId/location').put((req: Request, res: Response) => {
    
});

export default userRouter;