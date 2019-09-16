const getURLs = require("./urls");
const { getTopicsCount } = require("../../models");
const axios = require("axios");
const { Topic } = require("../../models");

module.exports = async function() {
    const count = await getTopicsCount();
    const urls = getURLs(count === 0);

    await axios.all(urls.map(url => axios.get(url))).then(
        axios.spread(async function(...responses) {
            let topics = [];
            responses.forEach(res => {
                const { tops, Title } = res.data;
                tops.forEach(top => (top.Region = Title));
                topics = topics.concat(tops);
            });

            topics = topics.slice(0, 5);

            topicsPromises = topics.map(({ Region, DateCreated, Title, PartnerTitle, Url, Id }) => {
                return Topic.create({
                    topicID: Id,
                    url: Url,
                    partner: PartnerTitle,
                    region: Region,
                    title: Title,
                    date: new Date(DateCreated * 1000),
                    isLoaded: false
                }).catch(e => {
                    if (e.code !== 11000) {
                        //console.log(e);
                    }
                    return null;
                });
            });
            await Promise.all(topicsPromises).then(topics => {
                topics = topics.filter(el => el != null);
                console.log(`Topics created: ${topics.length}`);
            });
        })
    );
};
