const Apify = require("apify");
const get = require("./utils/get");
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
    const sources = await tools.getSources();
    if (!sources.length) {
        console.log("WARNING: No sources. Crawl not started");
        return;
    }
    const requestList = await Apify.openRequestList(null, sources);
    const requestQueue = await Apify.openRequestQueue();
    const router = tools.createRouter({ requestQueue });

    log.debug("Setting up crawler.");
    const crawler = new Apify.BasicCrawler({
        //maxRequestsPerCrawl: 50,
        requestList,
        requestQueue,
        handleRequestFunction: async context => {
            await get(context.request.url)
                .then(async data => {
                    context.html = data;
                    await router(context.request.userData.label, context);
                })
                .catch(e => {
                    console.log(`ERROR: Could not get response: ${e}`);
                });
        }
    });

    log.info("Starting the crawl.");
    await crawler.run();
    log.info("Crawl finished.");
}
