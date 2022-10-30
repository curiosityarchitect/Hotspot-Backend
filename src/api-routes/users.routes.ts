import { Router, Request, Response, RequestHandler } from "express";
import { User } from "../schema/user.schema"
import * as mongoose from "mongoose";

const userRouter: Router = Router();

userRouter.route('/users').get((req: Request, res: Response) => {
    if (req.query.search) {
        let starts: object[] = [];
        let contains: object[] = [];
        const startRegex = `^(${req.query.search}).*`;
        const containsRegex = `.+(${req.query.search}).*`;
        User.find({
            username: {
                $regex : startRegex
            }
        })
        .lean() // returns a json not a document
        .then(users => {
            starts = users;
            return User.find({
                username: {
                    $regex : containsRegex
                }
            }).lean();
        })
        .then(users => {
            contains = users;

            const result = starts.concat(contains);
            res.json(result);
        })
        .catch(err => res.status(400).json("Error: No users found"));
    } else {
        User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(400).json("Error: No users found"));
    }
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

userRouter.route('/users/:userId').get((req: Request, res: Response) => {
    User.findById(req.params.userId)
    .then(user => res.json(user))
    .catch(err => res.status(400).json(err));
});

export default userRouter;