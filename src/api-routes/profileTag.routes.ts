import { Router, Request, Response } from "express";
import { profTag } from "../schema/profileTag.schema"
import bodyParser from "body-parser";

const profileTagsRouter: Router = Router();
profileTagsRouter.use(bodyParser.json());

profileTagsRouter.route('/profile/:username/tags').post((req: Request, res: Response) => {


    const newTag = new profTag({
        description: req.body.description,
        username: req.params.username,
    });
    newTag.save()
    .then(() => res.json('Profile tag added'))
    .catch(err => res.status(400).json("ERROR: profile tag could not be added"));
});


profileTagsRouter.route('/profile/:username/tags').get((req: Request, res: Response) => {
    const username = req.params.username;
    profTag.findOne({username}) // change to find() to get all tags
    .then((tag) => res.json(tag))
    .catch(err => res.status(400).json(err));
});








export default profileTagsRouter;