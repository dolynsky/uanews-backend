const Filter = require("../../models/filter");

module.exports = async function(topic) {
    const filters = await Filter.find({}, 'text');

    const content = topic.content.toLowerCase();
    let matches = 0;
    filters.forEach((text, isExclude) => {
        if (!isExclude && content.includes(text)) {
            matches++;
        }
    });

    const title = topic.title.toLowerCase();
    matches = 0;
    filters.forEach(({text, isExclude}) => {
        if (title.includes(text)) {
            if (!isExclude) {
                matches++;
            } else {
                topic.isExcluded = true;
            }
        }
    });

    topic.titleMatches = matches;
    topic.contentMatches = matches;
    await topic.save();
};
