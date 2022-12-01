import { Router, Request, Response } from "express";
import { profTag } from "../schema/profileTag.schema"
import bodyParser from "body-parser";
import { User } from "../schema/user.schema"

const profileTagsRouter: Router = Router();
profileTagsRouter.use(bodyParser.json());

profileTagsRouter.route('/profile/:username/tags').post((req: Request, res: Response) => {
    User.findOne({username: req.params.username})
    .then((user) => {
        if (!user) {
            throw new Error(`no user with username ${req.params.username}`);
        }
        return null;
    })
    .then(() => {
        const description: string = req.body.description;
        const username: string = req.params.username;
        const newProfTag = new profTag(
            {
                description,
                username
            });
        return newProfTag.save();
    })
    .then((tag) => res.json(tag))
    .catch(err => res.status(400).json(err));
});


profileTagsRouter.route('/profile/tag/:description').get((req: Request, res: Response) => {
    profTag.find({description: req.params.description}).select('username')
        .then((user) => res.json(user))
        .catch(err => res.status(400).json(err));
});








export default profileTagsRouter;