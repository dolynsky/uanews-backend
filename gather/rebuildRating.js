const Topic = require("../models/topic");
const calcRating = require("./calcContentMatches");

module.exports = async function() {
    const tps = await Topic.find({});
    tps.forEach(topic => {
        calcRating(topic);
    })
}