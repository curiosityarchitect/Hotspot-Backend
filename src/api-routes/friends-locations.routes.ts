import { Router, Request, Response, RequestHandler } from "express";
import * as mongoose from "mongoose";

const friendLocationRouter: Router = Router();

friendLocationRouter.route('/users/:userId/location').put((req: Request, res: Response) => {
    const x = 0;
});

export default friendLocationRouter;