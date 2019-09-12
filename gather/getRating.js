const Topic = require("../models/topic");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function() {
    const topics = await Topic.find({ rating: 0, ratingAvailable: false }).limit(5);
    console.log(`Gathering raiting for ${topics.length} topics`);

    topics.forEach(topic => {
        axios.get(topic.url)
        .then(res => {
            const $ = cheerio.load(res.data);
            console.log("url:", topic.url);
            const selectors = ['article', '*[class*="article"]'];
            let contents = "";
            selectors.forEach(sel => {
                const nodes = $(sel);
                nodes.each((i, el) => {
                    let text = $(el).text();
                    text = text.replace(/[ \n\t]+/g, " ");
                    if (text.length > contents.length) {
                        contents = text;
                    }
                });
            });
            console.log("contents:", contents);
        })
        /*.catch(e => {
            console.log(`Error: ${e.code}`);
            topic.ratingAvailable = true;
            topic.save();
        })*/;
    });
}

// save content
// content is either article if available (gold rating) or whole body (silver rating)
// rating types: 0 none 1 silver 2 gold