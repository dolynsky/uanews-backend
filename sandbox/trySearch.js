const cheerio = require("cheerio");
const DOMSearcher = require("../gather/search/DOMSearcher");
const get = require("../gather/utils/get");
const tsnua = require("../gather/routes/sites/tsnua").default;

const url = "https://ura-inform.com/ru/capital/2019/09/17/klichko-obratitsja-k-parlamentu-po-povodu-rospuska-kievrady";
const router = tsnua({saveToDB: false});

get(url)
    .then(async data => {
        // const results = await router.DETAIL({request: {url}, html: data});
        const $ = cheerio.load(data);
        const results = $('.datetime').text();
        const match = results.match(/(\d+):(\d+).(\d+)\.(\d)+\.(\d+)/);
        console.log(results);
        console.log(match);
        console.log(new Date(match[5], match[4]-1, match[3], match[1], match[2]))
    })
    .catch(e => {
        console.log(e);
    });
