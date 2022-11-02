import * as dotenv from 'dotenv'
dotenv.config();

import cors from "cors";
import express from "express";
import mongoose, { mongo } from "mongoose";
import eventsRouter from "./api-routes/events.routes"
import userRouter from './api-routes/users.routes';
import eventTagsRouter from './api-routes/eventTag.routes';
import friendRequestRouter from './api-routes/friend-request.routes';
import RsvpRouter from './api-routes/eventsRSVP.routes';

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
});

mongoose.connect("mongodb+srv://wangej:VxibwpanTBdbOKvS@cluster0.uclzqdl.mongodb.net/?");

const connection = mongoose.connection;
connection.once('open', () => {
    // tslint:disable-next-line:no-console
    console.log("mongodb connection established!");
});

const allowedOrigins = ["http:://localhost:19006"];

const options: cors.CorsOptions = {
    origin: allowedOrigins
}

app.use(cors(options));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(eventsRouter);
app.use(userRouter);
app.use(eventTagsRouter);
app.use(friendRequestRouter);
app.use(RsvpRouter);

// start the Express server
app.listen( port, () => {
    // console.log( `server started at http://localhost:${ port }` );
} );