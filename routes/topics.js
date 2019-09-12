const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");

router.get("/", function(req, res, next) {
  Topic.find({})
    .then(todos => res.send(todos))
    .catch(err => next(err));
});

module.exports = router;
