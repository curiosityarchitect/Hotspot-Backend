import * as dotenv from 'dotenv'
dotenv.config();

import express from "express";
import mongoose, { mongo } from "mongoose";
import eventsRouter from "./api-routes/events.routes"
import userRouter from './api-routes/users.routes';

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

app.use(eventsRouter);
app.use(userRouter);

// start the Express server
app.listen( port, () => {
    // console.log( `server started at http://localhost:${ port }` );
} );