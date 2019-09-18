const cheerio = require("cheerio");
const DOMSearcher = require("../utils/search/DOMSearcher");
const get = require("../gather/utils/get");
const tsnua = require("../gather/routes/sites/tsnua").default;
const utils = require("../utils");

const url = "https://vechirniy.kyiv.ua/news/do-ofisu-prezydenta-u-kyyevi-pryydut-z-klimatychnymy-vymohamy";
const urlTitle = "До Офісу президента у Києві прийдуть з кліматичними вимогами";
//const router = tsnua({saveToDB: false});

get(url)
    .then(async data => {
        // const results = await router.DETAIL({request: {url}, html: data});
        console.log(`HTML: ${data}`);
        console.log(`HTML length: ${data.length}`);
        const $ = cheerio.load(data);
        const sel = utils.getTextSelector(data, urlTitle);
        console.log(`Selector: ${sel}`);
        const title = $(".news-view > h2").text();
        console.log(`Title: ${title}`);
    })
    .catch(e => {
        console.log(e);
    });
