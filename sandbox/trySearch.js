const cheerio = require("cheerio");
const DOMSearcher = require("../gather/search/DOMSearcher");
const get = require("../gather/utils/get");
const tsnua = require("../gather/routes/sites/tsnua").default;

const url = "https://tsn.ua/ukrayina/ochilnik-dbr-anonsuvav-zavershennya-u-spravi-pro-vbivstvo-na-kiyivschini-5-richnogo-hlopchika-1412631.html";
const router = tsnua({saveToDB: false});

get(url)
    .then(async data => {
        const results = await router.DETAIL({request: {url}, html: data});
        console.log(results);
    })
    .catch(e => {
        console.log(e);
    });
