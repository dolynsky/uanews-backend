const {Topic} = require("../models");
const calcContentMatches = require("./calcContentMatches");
const calcTitleMatches = require("./calcTitleMatches");

module.exports = async function() {
    const tps = await Topic.find({});
    tps.forEach(topic => {
        calcTitleMatches(topic).then(() => {
            calcContentMatches(topic);
        });
    });
};
