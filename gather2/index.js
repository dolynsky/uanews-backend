const Apify = require('apify');
const tools = require('./tools');
const {
    utils: { log },
} = Apify;

module.exports = async function () {
    log.info('Starting gather.');
    const requestList = await Apify.openRequestList('main', await tools.getSources());
    const requestQueue = await Apify.openRequestQueue();
    const router = tools.createRouter({ requestQueue });

    log.debug('Setting up crawler.');
    const crawler = new Apify.BasicCrawler({});

    const crawler = new Apify.CheerioCrawler({
        //maxRequestsPerCrawl: 50,
        requestList,
        requestQueue,
        handlePageFunction: async context => {
            const { request } = context;
            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);
        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Gather finished.');
}
