const Apify = require("apify");
const { Topic, checkSomeUrlLoaded, getCountOfTopicsFromDomain, checkUrlLoaded } = require("../../models");
const DOMSearcher = require("../search/DOMSearcher");
const {
    utils: { log }
} = Apify;

exports.default = {
    DETAIL: async ({ $, request, html }) => {
        const topic = await Topic.findOne({ url: request.loadedUrl });
        if (!topic) {
            log.error("Default router: no topic found with url:", request.loadedUrl);
            return;
        }

        const title = topic.title.replace(/[\[\(](фото)?,? ?(в[іи]део)?[\]\)]/gi, "");

        const domSearcher = new DOMSearcher({ html });
        const titleSelectors = domSearcher.find([title]);

        if (!titleSelectors.length) {
            log.error("Default router: no title selectors found with url:", request.loadedUrl);
            return;
        }

        const titleSelector = titleSelectors[0].selector;
        log.debug(`titleSelectors:`)
        console.log(titleSelectors)

        let content = "";
        let nodes = $(titleSelector);

        if (nodes.length > 0) {
            content = trimText(nodes.text());
            while (content.length < 500) {
                nodes = nodes.parent();
                content = trimText(nodes.text());
            }
        }

        topic.content = content;
        topic.isLoaded = true;
        topic
            .save()
            .then(() => {
                if (topic.content) {
                    //calcContentMatches(topic);
                }
            })
            .catch((e) => {
                log.error(e);
            });
    }
};

function trimText(text) {
    return text.replace(/[ \n\t]+/g, " ");
}