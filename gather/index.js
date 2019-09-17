const Apify = require("apify");
const request = require("request");
const iconv = require("iconv");
const tools = require("./tools");
const prepopulateFromUkrNet = require("./ukrnet/prepopulateFromUkrNet");
const {
    utils: { log }
} = Apify;

log.setLevel(log.LEVELS.DEBUG);

module.exports = async function() {
    await prepopulateFromUkrNet();
    crawlPages();
};

async function crawlPages() {
    log.info("Starting gather.");
    const requestList = await Apify.openRequestList(null, await tools.getSources());
    const requestQueue = await Apify.openRequestQueue();
    const router = tools.createRouter({ requestQueue });

    log.debug("Setting up crawler.");
    const crawler = new Apify.BasicCrawler({
        //maxRequestsPerCrawl: 50,
        requestList,
        requestQueue,
        handleRequestFunction: async context => {
            request(
                {
                    uri: context.request.url,
                    method: "GET",
                    encoding: "binary"
                },
                async function(error, response, body) {
                    log.info(`Processing ${context.request.url}`);
                    if (error) {
                        log.error(`Could not get response: ${error}`);
                        return;
                    }
                    var ctype = response.headers["content-type"];
                    body = Buffer.from(body, "binary");
                    if (ctype.includes("charset=windows-1251")) {
                        conv = new iconv.Iconv("windows-1251", "utf8");
                    } else {
                        conv = new iconv.Iconv("utf8", "utf8//IGNORE");
                    }
                    body = conv.convert(body).toString();
                    context.html = body;
                    await router(context.request.userData.label, context);
                }
            );
        }
    });

    log.info("Starting the crawl.");
    await crawler.run();
    log.info("Gather finished.");
}
