import { Router, Request, Response } from "express";
import { ProfileChanges } from "../schema/settings.schema";
import bodyParser from "body-parser";
import { profTag } from "../schema/profileTag.schema";
import { User } from "../schema/user.schema";

const profileRouter: Router = Router();
profileRouter.use(bodyParser.json());

// for insomnia use - login and redux stores should initialize this
profileRouter.route('/profile/:username/settings').post((req: Request, res: Response) => {
    const newProfileTag = req.body.profTags;
    const profileChange = new ProfileChanges(
        {
            displayName: req.body.displayName,
            phoneNumber: req.body.phoneNumber,
            displayLocation: req.body.displayLocation,
            username: req.params.username,
            profTags: newProfileTag
        });

    profileChange.save()
        .then(() => {
                    const newProfTag = new profTag(
                        {
                            description: newProfileTag,
                            username: req.params.username
                        });
                    return newProfTag.save();
                })
        .catch(err => res.status(400).json(err));
});


profileRouter.route('/profile/:username/settings').put((req: Request, res: Response) => {
    ProfileChanges.findOneAndUpdate({username: req.params.username}, req.body).then((profileChange) => {
        if (req.params.username !== profileChange.username) {
           ProfileChanges.findOneAndDelete({username: req.params.username})
        }
    })
        .then(profile => res.json(profile)).then(() => {
            if (req.body.profTags) {
                profTag.findOneAndUpdate({username: req.params.username}, {description: req.body.profTags}).then((profile) => {
                    if (!profile) {
                        const newProfTag = new profTag(
                            {
                                description: req.body.profTags,
                                username: req.params.username
                            });
                        return newProfTag.save();
                    }
                })
            }
        })
        .catch(err => res.status(400).json(err));
});



profileRouter.route('/profile/:username/settings').get((req: Request, res: Response) => {
    const username = req.params.username;
    ProfileChanges.findOne({username}).lean()
        .then((profile) => res.json(profile))
        .catch(err => res.status(400).json(err));
});



export default profileRouter;