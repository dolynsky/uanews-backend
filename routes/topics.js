const express = require("express");
const router = express.Router();
const {Topic} = require("../models");

const fields = ["url", "region", "title", "date", "titleMatches", "contentMatches"];

const basicSelect = () => {
    return { isExcluded: false, $or: [{ titleMatches: { $gt: 0 } }, { contentMatches: { $gt: 1 } }] };
};
const dateSelect = (timestamp) => { return { date: {$gt: new Date(timestamp * 1000)} } };

router.get("/after/:timestamp", function(req, res, next) {
    const { timestamp } = req.params;
    const query = Object.create({}, ...basicSelect(), ...dateSelect(timestamp));
    Topic.find(query, fields)
        .sort({ date: "desc" })
        .then(topics => res.send(topics))
        .catch(err => next(err));
});

router.get("/*?", function(req, res, next) {
    const index = req.params[0] || 1;
    const query = Object.create({}, ...basicSelect());
    Topic.find(query, fields)
        .sort({ date: "desc" })
        .skip(50 * (index - 1))
        .limit(50)
        .then(topics => res.send(topics))
        .catch(err => next(err));
});

module.exports = router;
