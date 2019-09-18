const Apify = require("apify");
const { findByURL } = require("../../models");
const calcMatches = require("../utils/calcMatches");
const { getContentNearNode, cleanUpTitle, getTextSelector } = require("../../utils");
const cheerio = require("cheerio");
const {
    utils: { log }
} = Apify;

exports.default = {
    DETAIL: async ({ request, html }) => {
        const $ = cheerio.load(html);
        const topic = await findByURL(request.url);
        let content = "";

        if (topic) {
            const title = cleanUpTitle(topic.title);
            const titleSelector = getTextSelector(html, title);
            if (titleSelector) {
                content = getContentNearNode($(titleSelector));
            } else {
                log.error("Default router: no title selectors found with url:", request.url);
            }
        } else {
            log.error("Default router: no topic found with url:", request.url);
        }

        topic.content = content;
        topic.isLoaded = true;
        try {
            await topic.save();
            if (topic.content) {
                await calcMatches(topic);
            }
        } catch (e) {
            log.error(e);
        }
    }
};
