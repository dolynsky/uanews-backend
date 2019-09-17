const { Topic } = require("../../models");
const calcMatches = require("./calcMatches");

module.exports = async function() {
    const tps = await Topic.find({});
    tps.forEach(topic => {
        calcMatches(topic);
    });
};
