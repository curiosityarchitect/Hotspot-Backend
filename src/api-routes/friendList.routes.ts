import { Router, Request, Response } from "express";
import {friends} from "../schema/friends.schema"
import { User } from "../schema/user.schema"

const friendsRouter: Router = Router();

friendsRouter.route('/friends/:username').get((req: Request, res: Response) => {
    const user = req.params.username
    Promise.all([
        friends.find({ username1: user }).select('username2'),
        friends.find({ username2: user }).select('username1'),
    ]).then((combineQuery) => {
        const [query1,query2] = combineQuery;
        const friendCount = query1.length + query2.length;
        res.json([friendCount,...query1, ...query2]);
    })
    .catch(err => res.status(err).json("Error: No relation found"));


});

friendsRouter.route('/friends/:username/count').get((req: Request, res: Response) => {
    const user = req.params.username
    Promise.all([
        friends.find({ username1: user }).select('username2'),
        friends.find({ username2: user }).select('username1'),
    ]).then((combineQuery) => {
        const [query1,query2] = combineQuery;
        const friendCount = query1.length + query2.length;
        res.json(friendCount);
    })
    .catch(err => res.status(err).json("Error: No relation found"));
});

// username: current user ... toDelete: friend to delete
friendsRouter.route('/friends/unadd').delete((req: Request, res: Response) => {
    const username = req.body.username;
    const toDelete = req.body.toDelete;
    Promise.all([
        friends.findOneAndDelete({username1: username, username2: toDelete}),
        friends.findOneAndDelete({username1: toDelete, username2: username})
    ]).then(() => res.json('Friend has been deleted!'))
    .catch(err => res.status(err).json("Error: No relation found"));
});

export default friendsRouter;