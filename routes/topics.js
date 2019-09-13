const express = require("express");
const router = express.Router();
const Topic = require("../models/topic");

const fields = ["url", "region", "title", "date", "titleMatches", "contentMatches"];

router.get("/after/:timestamp", function(req, res, next) {
  const { timestamp } = req.params;
    Topic.find({isExcluded: false, date: {$gt: new Date(timestamp * 1000)}, $or: [{ titleMatches: {$gt: 0} }, { contentMatches: {$gt: 1} }] }, fields)
        .sort({ date: "desc" })
        .then(topics => res.send(topics))
        .catch(err => next(err));
});

router.get("/*?", function(req, res, next) {
  const index = req.params[0] || 1;
    Topic.find({ isExcluded: false, $or: [{ titleMatches: {$gt: 0} }, { contentMatches: {$gt: 1} }] }, fields)
        .sort({ date: "desc" })
        .skip(50 * (index - 1))
        .limit(50)
        .then(topics => res.send(topics))
        .catch(err => next(err));
});

module.exports = router;
