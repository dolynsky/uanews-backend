const Apify = require("apify");
const cheerio = require("cheerio");
const { URL } = require("url");
const { getDomainName, getHttpDomainName } = require("../../../utils");
const { Topic, checkSomeUrlLoaded, getCountOfTopicsFromDomain, findByURL } = require("../../../models");
const calcMatches = require("../../utils/calcMatches");
const { trimText } = require("../../../utils/index");
const {
    utils: { log }
} = Apify;
const MIN_TOPICS_FROM_DOMAIN = 50;

exports.default = ({ topicsSelector, nextSelector, detailTitleSelector, detailContentSelector, detailDateSelector, dateParser, saveToDB = true }) => {
    return {
        MAIN: async ({ $, request }, { requestQueue }) => {
            const httpDomainName = getHttpDomainName(request.url);
            const domainName = getDomainName(request.url);

            const urls = $(topicsSelector)
                .map((i, el) => new URL($(el).attr("href"), httpDomainName).href)
                .get();
            const loadMore = !(await checkSomeUrlLoaded(urls));

            if (urls.length === 0) {
                log.error(`No data was scraped from ${domainName}`);
            }

            await Apify.utils.enqueueLinks({
                $,
                requestQueue,
                selector: topicsSelector,
                baseUrl: request.url,
                transformRequestFunction: req => {
                    req.userData.label = "DETAIL";
                    return req;
                }
            });

            let loadHistory = false;
            const topicsFromDomain = await getCountOfTopicsFromDomain(domainName);

            if (request.userData.state === "INITIAL") {
                if (topicsFromDomain < MIN_TOPICS_FROM_DOMAIN) {
                    loadHistory = true;
                }
            } else {
                loadHistory = request.userData.loadHistory;
            }

            console.log(`loadMore: ${loadMore}, loadHistory: ${loadHistory}, topicsFromDomain: ${topicsFromDomain}`);

            if ((loadHistory && topicsFromDomain < MIN_TOPICS_FROM_DOMAIN) || (!loadHistory && loadMore)) {
                if (nextSelector && saveToDB) {
                    await Apify.utils.enqueueLinks({
                        $,
                        requestQueue,
                        selector: nextSelector,
                        baseUrl: request.url,
                        transformRequestFunction: req => {
                            req.userData.label = "MAIN";
                            req.userData.loadHistory = loadHistory;
                            return req;
                        }
                    });
                }
            }
        },
        DETAIL: async ({ request, html }) => {
            const $ = cheerio.load(html);
            const domain = getDomainName(request.url);
            const results = {
                url: request.url,
                partner: domain,
                title: $(detailTitleSelector).text(),
                content: trimText($(detailContentSelector).text()),
                date: dateParser($(detailDateSelector)),
                isLoaded: true
            };

            if (saveToDB) {
                const res = await Topic.updateOne({ url: request.url }, results, { upsert: true });
                console.log(`update result: matched ${res.n}, modified ${res.nModified}`)
                const topic = await findByURL(request.url);
                if (topic.content) {
                    await calcMatches(topic);
                }
            }
            return results;
        }
    };
};
