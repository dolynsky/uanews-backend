const cheerio = require("cheerio");
const axios = require("axios");
const getContent = require("../gather/getContent");
const {Topic} = require("../models");

const url = "https://westnews.info/news/Dorobiti-remont-vul-Zamarstinivskoyi-yak-planuvali-nema-ni-groshej-ni-mozhlivostej.html";

// Topic.findOne({topicID: 41301141})
// .then(topic => {
//    getContent(topic);
// })

getContent({
   url,
   title: "Доробити ремонт вул. Замарстинівської, як планували, - нема ні грошей, ні можливостей",
   save: () => {return new Promise((resolve) => resolve())}
});