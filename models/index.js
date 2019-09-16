const Topic = require("./Topic");

module.exports.Topic = Topic;

module.exports.getTopicsCount = async function() {
    const found = await Topic.find({}).countDocuments();
    return found;
};

module.exports.getUnloadedTopics = async function() {
    const found = await Topic.find({isLoaded: false});
    return found;
};

module.exports.checkUrlLoaded = async function(url) {
    const found = await Topic.find({ url }).countDocuments();
    return found > 0;
};

module.exports.checkSomeUrlLoaded = async function(urls) {
    const found = await Topic.find({ url: { $in: urls } }).countDocuments();
    return found > 0;
};

module.exports.getCountOfTopicsFromDomain = async function(domainName) {
    const topics = await Topic.find({ domain: domainName });
    return topics.length;
};
