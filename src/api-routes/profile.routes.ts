import { Router, Request, Response } from "express";
import { ProfileChanges } from "../schema/settings.schema";
import bodyParser from "body-parser";

const profileRouter: Router = Router();
profileRouter.use(bodyParser.json());

// for insomnia use - login and redux stores should initialize this
profileRouter.route('/profile/:username/settings').post((req: Request, res: Response) => {
    const profileChange = new ProfileChanges(
        {
            displayName: req.body.displayName,
            phoneNumber: req.body.phoneNumber,
            displayLocation: req.body.displayLocation,
            username: req.params.username,
            profTags: req.body.profTags,
        });

    profileChange.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err));

});

profileRouter.route('/profile/:username/settings').put((req: Request, res: Response) => {
    ProfileChanges.findOneAndUpdate({username: req.params.username}, req.body)
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err));
});

profileRouter.route('/profile/:username/settings').get((req: Request, res: Response) => {
    const username = req.params.username;
    ProfileChanges.findOne({username}).lean()
        .then((profile) => res.json(profile))
        .catch(err => res.status(400).json(err));
});



export default profileRouter;