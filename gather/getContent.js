const axios = require("axios");
const cheerio = require("cheerio");
const calcContentMatches = require("./calcContentMatches");

module.exports = async function(topic) {

    axios
        .get(topic.url)
        .then(res => {
            const $ = cheerio.load(res.data);
            //console.log(`Gathering content for: ${topic.title}. URL: ${topic.url}`);
            const selector = $(`h1:contains("${topic.title}"),h2:contains("${topic.title}"),h3:contains("${topic.title}")`);
            let nodes = $(selector);
            let content = "";
            if (nodes.length > 0) {
                content = trimText(nodes.text());
                while (content.length < 500) {
                    nodes = nodes.parent();
                    content = trimText(nodes.text());
                }
            }
            topic.content = content;
        })
        .catch(e => {
            console.log(`Error: ${e.code}`);
        })
        .finally(() => {
            topic.save()
            .then(() => {
                if (topic.content) {
                    calcContentMatches(topic);
                }
            });
        });
};

function trimText(text) {
    return text.replace(/[ \n\t]+/g, " ");
}
