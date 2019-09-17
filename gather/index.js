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
            await get(context.request.url)
                .then(async data => {
                    context.html = data;
                    await router(context.request.userData.label, context);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    });

    log.info("Starting the crawl.");
    await crawler.run();
    log.info("Gather finished.");
}
