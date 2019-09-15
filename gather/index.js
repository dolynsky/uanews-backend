const Topic = require("../models/topic");
const axios = require("axios");
const getContent = require("./getContent");
const calcRating = require("./calcContentMatches");
const calcTitleMatches = require("./calcTitleMatches");

const regions = [
    "kiev",
    "ivano_frankovsk",
    "lutsk",
    "zhitomir",
    "lvov",
    "poltava",
    "ternopol",
    "hmelnitskij",
    "chernovtsy",
    "dnepropetrovsk",
    "uzhgorod",
    "kirovograd",
    "nikolaev",
    "rovno",
    "kharkov",
    "cherkassy",
    "vinnitsa",
    "zaporozhje",
    "odessa",
    "sumy",
    "herson",
    "chernigov"
];

function getUrl(city, page) {
    const template = "https://www.ukr.net/news/dat/{city}/{page}";
    let url = template.replace("{city}", city);
    if (page > 1) {
        url = url.replace("{page}", String(page) + "/");
    } else {
        url = url.replace("{page}", "");
    }
    return url;
}

module.exports = async function () {
    console.log("Gather data...");
    let depth = 1;
    const topicsinDB = await Topic.find({}).countDocuments();
    if (topicsinDB === 0) {
        //depth = 10;
    }

    let urls = [];
    regions.forEach(city => {
        for (let page = 1; page <= depth; page++) {
            urls.push(getUrl(city, page));
        }
    });

    axios.all(urls.map(url => axios.get(url))).then(
        axios.spread(function(...responses) {
            let topics = [];
            responses.forEach(res => {
                const { tops, Title } = res.data;
                tops.forEach(top => (top.Region = Title));
                topics = topics.concat(tops);
            });

            //topics = topics.slice(0, 5);

            topicsPromises = topics.map(({ Region, DateCreated, Title, PartnerTitle, Url, Id }) => {
                return Topic.create({
                    topicID: Id,
                    url: Url,
                    partner: PartnerTitle,
                    region: Region,
                    title: Title,
                    date: new Date(DateCreated * 1000)
                })
                .then(async function(topic) {
                    //console.log(`Topic created: ${topic.title}`);
                    await calcTitleMatches(topic);
                    await getContent(topic);
                    return topic;
                })
                .catch(e => {
                    if (e.code !== 11000) {
                        //console.log(e);
                    }
                    return null;
                });
            });
            Promise.all(topicsPromises)
            .then((topics)=>{
                topics = topics.filter(el => el != null);
                console.log(`Topics created: ${topics.length}`);
            })
        })
    );
}