const router = require("express").Router();
let events = require("../models/event");

router.route('/events').post((req, res) => {
    events.create()
});

