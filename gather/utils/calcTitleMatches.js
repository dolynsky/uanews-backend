const Filter = require("../../models/filter");

module.exports = async function(topic) {
    const filters = await Filter.find({});

    const content = topic.title.toLowerCase();
    let matches = 0;
    filters.forEach(({text, isExclude}) => {
        if (content.includes(text)) {
            if (!isExclude) {
                matches++;
            } else {
                topic.isExcluded = true;
            }
        }
    });

    //console.log(`Title matches: ${matches} (${topic.title})`);
    topic.titleMatches = matches;
    await topic.save();
};
