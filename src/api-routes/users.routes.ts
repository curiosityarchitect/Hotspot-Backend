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
        password
    });
    newUser.save()
    .then(() => res.json('User added'))
    .catch(err => res.status(400).json("ERROR: user could not be added"));
});

export default userRouter;