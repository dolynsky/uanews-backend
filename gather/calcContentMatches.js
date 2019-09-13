const Filter = require("../models/filter");

module.exports = async function(topic) {
    const filters = await Filter.find({}, 'text');

    const content = topic.content.toLowerCase();
    let matches = 0;
    filters.forEach((text, isExclude) => {
        if (!isExclude && content.includes(text)) {
            matches++;
        }
    });

    //const rating = filters.map(el => topic.content.includes(el) ? 1 : 0).reduce((prev, current) => prev + current, 0);
    console.log(`Content matches: ${matches} (${topic.title})`);
    topic.contentMatches = matches;
    await topic.save();
};
