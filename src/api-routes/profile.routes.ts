import { Router, Request, Response } from "express";
import { ProfileChanges } from "../schema/settings.schema";
import bodyParser from "body-parser";

const profileRouter: Router = Router();
profileRouter.use(bodyParser.json());

profileRouter.route('/profile/:username/settings').post((req: Request, res: Response) => {
    const profileChange = new ProfileChanges(
        {
            displayName: req.body.displayName,
            phoneNumber: req.body.phoneNumber,
            displayLocation: req.body.displayLocation,
            username: req.params.username,
            profTags: req.body.profTags,
          //  newUsername: req.body.username,
        });

    profileChange.save()
        .then(() => {
            ProfileChanges.findOneAndDelete({username: req.params.username})
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err));
        })
});

profileRouter.route('/profile/:username/settings').get((req: Request, res: Response) => {
    const username = req.params.username;
    ProfileChanges.findOne({username}).lean()
        .then((profile) => res.json(profile))
        .catch(err => res.status(400).json(err));
});



export default profileRouter;