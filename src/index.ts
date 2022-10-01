import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

mongoose.connect(process.env.URI);
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("mongodb connection established!");
});

// start the Express server
app.listen( port, () => {
    // console.log( `server started at http://localhost:${ port }` ); // eslint-disable-line no-console
} );