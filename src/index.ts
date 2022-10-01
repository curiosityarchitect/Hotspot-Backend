import * as dotenv from 'dotenv'
dotenv.config();

import express from "express";
import mongoose, { mongo } from "mongoose";
import eventsRouter from "./api-routes/events.routes"

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

mongoose.connect(process.env.MONGODB_URI);

const connection = mongoose.connection;
connection.once('open', () => {
    // tslint:disable-next-line:no-console
    console.log("mongodb connection established!");
});

app.use(eventsRouter);

// start the Express server
app.listen( port, () => {
    // console.log( `server started at http://localhost:${ port }` );
} );