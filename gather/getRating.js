const Topic = require("../models/topic");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function() {
    const topics = await Topic.find({ rating: 0, ratingAvailable: false }).limit(5);
    console.log(`Gathering raiting for ${topics.length} topics`);

    topics.forEach(topic => {
        console.log("url:", topic.url)
        axios.get(topic.url)
        .then(res => {
            const $ = cheerio.load(res.data);
            console.log("tag:", $('article').get().length);
            console.log("id:", $('#article').get().length);
            console.log("class:", $('*[class*="article"]').get().length);
            
        })
        .catch(e => {
            console.log(`Error: ${e.code}`);
        });
    });
}