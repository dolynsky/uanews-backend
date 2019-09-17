const Apify = require("apify");
const { Topic, findByURL } = require("../../models");
const calcContentMatches = require("../utils/calcContentMatches");
const calcTitleMatches = require("../utils/calcTitleMatches");
const { trimText } = require("../../utils/index");
const DOMSearcher = require("../search/DOMSearcher");
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
            const titleSelector = getTitleSelector(html, title);
            if (titleSelector) {
                content = getContentNearTitle($(titleSelector));
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
                await calcTitleMatches(topic);
                await calcContentMatches(topic);
            }
        }
        catch (e) {
            log.error(e);
        }
    }
};

function cleanUpTitle(title) {
    return title.replace(/[\[\(](фото)?,? ?(в[іи]део)?[\]\)]/gi, "");
}

function getTitleSelector(html, title) {
    const $ = cheerio.load(html);
    const domSearcher = new DOMSearcher({ html });
    const titleSelectors = domSearcher.find([title]);
    let titleSelector = "";

    if (titleSelectors.length) {
        titleSelector = titleSelectors[0].selector;
        for (let i = 1; i < titleSelectors.length; i++) {
            if (titleSelector.length > titleSelectors[i].selector.length) {
                titleSelector = titleSelectors[i].selector;
            }
        }

        let nodes = $(titleSelector);

        if (nodes.length > 0) {
            content = trimText(nodes.text());
            while (content.length < 500) {
                nodes = nodes.parent();
                content = trimText(nodes.text());
            }
        }
    }
    return titleSelector;
}

function getContentNearTitle($node) {
    let content = "";

    if ($node.length > 0) {
        content = trimText($node.text());
        while (content.length < 500) {
            $node = $node.parent();
            content = trimText($node.text());
        }
    }
    return content;
}